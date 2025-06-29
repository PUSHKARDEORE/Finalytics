import { Router, Request, Response } from 'express';
import Transaction, { ITransaction } from '../models/Transaction';
import auth from '../middleware/auth';
import { Parser } from 'json2csv';

const router = Router();

// Get all transactions with filtering, sorting, and pagination
router.get('/', auth, async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = 'date',
      sortOrder = 'desc',
      category,
      status,
      user_id,
      search,
      startDate,
      endDate,
      minAmount,
      maxAmount
    } = req.query;

    // Build filter object
    const filter: any = {};
    
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (user_id) filter.user_id = user_id;
    
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate as string);
      if (endDate) filter.date.$lte = new Date(endDate as string);
    }
    
    if (minAmount || maxAmount) {
      filter.amount = {};
      if (minAmount) filter.amount.$gte = parseFloat(minAmount as string);
      if (maxAmount) filter.amount.$lte = parseFloat(maxAmount as string);
    }

    // Build search query with enhanced substring matching
    if (search) {
      const searchTerm = search.toString().trim();
      if (searchTerm) {
        filter.$or = [
          // Search in transaction ID (convert to string for partial matching)
          { id: { $regex: searchTerm, $options: 'i' } },
          // Search in user_id
          { user_id: { $regex: searchTerm, $options: 'i' } },
          // Search in category
          { category: { $regex: searchTerm, $options: 'i' } },
          // Search in status
          { status: { $regex: searchTerm, $options: 'i' } },
          // Search in user_profile
          { user_profile: { $regex: searchTerm, $options: 'i' } },
          // Search in amount (convert to string for partial matching)
          { 
            $expr: { 
              $regexMatch: { 
                input: { $toString: '$amount' }, 
                regex: searchTerm, 
                options: 'i' 
              } 
            } 
          },
          // Search in date (formatted as string)
          { 
            $expr: { 
              $regexMatch: { 
                input: { 
                  $dateToString: { 
                    format: '%Y-%m-%d', 
                    date: '$date' 
                  } 
                }, 
                regex: searchTerm, 
                options: 'i' 
              } 
            } 
          }
        ];
      }
    }

    // Build sort object
    const sort: any = {};
    sort[sortBy as string] = sortOrder === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    // Execute query
    const transactions = await Transaction.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit as string));

    // Get total count for pagination
    const total = await Transaction.countDocuments(filter);

    res.json({
      transactions,
      pagination: {
        currentPage: parseInt(page as string),
        totalPages: Math.ceil(total / parseInt(limit as string)),
        totalItems: total,
        itemsPerPage: parseInt(limit as string)
      }
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get transaction statistics for dashboard
router.get('/stats', auth, async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, category, status, user_id, search } = req.query;
    
    const filter: any = {};
    
    // Date filters
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate as string);
      if (endDate) filter.date.$lte = new Date(endDate as string);
    }

    // Category filter
    if (category) {
      filter.category = category;
    }

    // Status filter
    if (status) {
      filter.status = status;
    }

    // User ID filter
    if (user_id) {
      filter.user_id = user_id;
    }

    // Search filter with enhanced substring matching
    if (search) {
      const searchTerm = search.toString().trim();
      if (searchTerm) {
        filter.$or = [
          // Search in transaction ID (convert to string for partial matching)
          { id: { $regex: searchTerm, $options: 'i' } },
          // Search in user_id
          { user_id: { $regex: searchTerm, $options: 'i' } },
          // Search in category
          { category: { $regex: searchTerm, $options: 'i' } },
          // Search in status
          { status: { $regex: searchTerm, $options: 'i' } },
          // Search in user_profile
          { user_profile: { $regex: searchTerm, $options: 'i' } },
          // Search in amount (convert to string for partial matching)
          { 
            $expr: { 
              $regexMatch: { 
                input: { $toString: '$amount' }, 
                regex: searchTerm, 
                options: 'i' 
              } 
            } 
          },
          // Search in date (formatted as string)
          { 
            $expr: { 
              $regexMatch: { 
                input: { 
                  $dateToString: { 
                    format: '%Y-%m-%d', 
                    date: '$date' 
                  } 
                }, 
                regex: searchTerm, 
                options: 'i' 
              } 
            } 
          }
        ];
      }
    }

    // Get total revenue and expenses
    const revenueStats = await Transaction.aggregate([
      { $match: { ...filter, category: 'Revenue' } },
      { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }
    ]);

    const expenseStats = await Transaction.aggregate([
      { $match: { ...filter, category: 'Expense' } },
      { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }
    ]);

    // Get category breakdown
    const categoryBreakdown = await Transaction.aggregate([
      { $match: filter },
      { $group: { _id: '$category', total: { $sum: '$amount' }, count: { $sum: 1 } } }
    ]);

    // Get status breakdown
    const statusBreakdown = await Transaction.aggregate([
      { $match: filter },
      { $group: { _id: '$status', total: { $sum: '$amount' }, count: { $sum: 1 } } }
    ]);

    // Get monthly trends
    const monthlyTrends = await Transaction.aggregate([
      { $match: filter },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
            category: '$category'
          },
          total: { $sum: '$amount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    const revenue = revenueStats[0]?.total || 0;
    const expenses = expenseStats[0]?.total || 0;
    const netProfit = revenue - expenses;

    res.json({
      summary: {
        totalRevenue: revenue,
        totalExpenses: expenses,
        netProfit,
        totalTransactions: (revenueStats[0]?.count || 0) + (expenseStats[0]?.count || 0)
      },
      categoryBreakdown,
      statusBreakdown,
      monthlyTrends
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Export transactions to CSV
router.post('/export', auth, async (req: Request, res: Response) => {
  try {
    const {
      columns = ['id', 'date', 'amount', 'category', 'status', 'user_id'],
      filters = {}
    } = req.body;

    // Build filter object
    const filter: any = {};
    
    if (filters.category) filter.category = filters.category;
    if (filters.status) filter.status = filters.status;
    if (filters.user_id) filter.user_id = filters.user_id;
    
    if (filters.startDate || filters.endDate) {
      filter.date = {};
      if (filters.startDate) filter.date.$gte = new Date(filters.startDate);
      if (filters.endDate) filter.date.$lte = new Date(filters.endDate);
    }
    
    if (filters.minAmount || filters.maxAmount) {
      filter.amount = {};
      if (filters.minAmount) filter.amount.$gte = parseFloat(filters.minAmount);
      if (filters.maxAmount) filter.amount.$lte = parseFloat(filters.maxAmount);
    }

    if (filters.search) {
      const searchTerm = filters.search.toString().trim();
      if (searchTerm) {
        filter.$or = [
          // Search in transaction ID (convert to string for partial matching)
          { id: { $regex: searchTerm, $options: 'i' } },
          // Search in user_id
          { user_id: { $regex: searchTerm, $options: 'i' } },
          // Search in category
          { category: { $regex: searchTerm, $options: 'i' } },
          // Search in status
          { status: { $regex: searchTerm, $options: 'i' } },
          // Search in user_profile
          { user_profile: { $regex: searchTerm, $options: 'i' } },
          // Search in amount (convert to string for partial matching)
          { 
            $expr: { 
              $regexMatch: { 
                input: { $toString: '$amount' }, 
                regex: searchTerm, 
                options: 'i' 
              } 
            } 
          },
          // Search in date (formatted as string)
          { 
            $expr: { 
              $regexMatch: { 
                input: { 
                  $dateToString: { 
                    format: '%Y-%m-%d', 
                    date: '$date' 
                  } 
                }, 
                regex: searchTerm, 
                options: 'i' 
              } 
            } 
          }
        ];
      }
    }

    // Fetch transactions
    const transactions = await Transaction.find(filter).sort({ date: -1 });

    // Transform data for CSV
    const csvData = transactions.map(transaction => {
      const row: any = {};
      columns.forEach((column: string) => {
        if (column === 'date') {
          row[column] = transaction.date.toISOString().split('T')[0];
        } else {
          row[column] = transaction[column as keyof ITransaction];
        }
      });
      return row;
    });

    // Generate CSV
    const parser = new Parser({
      fields: columns as string[]
    });

    const csv = parser.parse(csvData);

    // Set headers for file download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=transactions-${new Date().toISOString().split('T')[0]}.csv`);

    res.send(csv);
  } catch (error) {
    console.error('Error exporting transactions:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get unique values for filters
router.get('/filters', auth, async (req: Request, res: Response) => {
  try {
    const categories = await Transaction.distinct('category');
    const statuses = await Transaction.distinct('status');
    const userIds = await Transaction.distinct('user_id');

    res.json({
      categories,
      statuses,
      userIds
    });
  } catch (error) {
    console.error('Error fetching filter options:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 