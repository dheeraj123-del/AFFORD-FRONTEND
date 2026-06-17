import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, Eye, Star, Database, ChevronLeft, ChevronRight, Grid, List } from 'lucide-react';
import { apiService, COMPANIES } from '../services/api';
import Sidebar from '../components/Sidebar';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Search query text
  const [searchQuery, setSearchQuery] = useState('');
  
  // Data source status info
  const [sourceInfo, setSourceInfo] = useState('');

  // Layout View Mode: 'grid' or 'table'
  const [viewMode, setViewMode] = useState('grid');

  // Pagination states
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const pageSize = 8; // 8 items per page fits beautifully in both grid and table views

  // Main filters state
  const [filters, setFilters] = useState({
    company: 'ALL',
    category: 'Laptop',
    minPrice: '',
    maxPrice: '',
    minRating: 1,
    onlyInStock: false,
    sortBy: '',
    order: 'asc'
  });

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1); // Reset page on filter modification
  };

  const handleReset = () => {
    setFilters({
      company: 'ALL',
      category: 'Laptop',
      minPrice: '',
      maxPrice: '',
      minRating: 1,
      onlyInStock: false,
      sortBy: '',
      order: 'asc'
    });
    setSearchQuery('');
    setPage(1);
  };

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      if (filters.company === 'ALL') {
        // Concurrently query all companies to aggregate results
        const promises = COMPANIES.map(comp => 
          apiService.getProducts({
            company: comp,
            category: filters.category,
            top: 40, // Fetch a healthy pool to allow local sorting and price filtering
            minPrice: filters.minPrice || 1,
            maxPrice: filters.maxPrice || 100000
          }).catch(err => {
            console.error(`Failed fetching for ${comp}:`, err);
            return { products: [] };
          })
        );

        const results = await Promise.all(promises);
        let aggregated = results.flatMap(r => r.products || []);

        // Apply Local Sidebar Filters
        if (filters.minRating > 1) {
          aggregated = aggregated.filter(p => p.rating >= filters.minRating);
        }
        if (filters.onlyInStock) {
          aggregated = aggregated.filter(p => p.availability === 'yes');
        }
        if (searchQuery.trim()) {
          aggregated = aggregated.filter(p => 
            p.productName.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }

        // Apply Local Sort
        if (filters.sortBy) {
          aggregated.sort((a, b) => {
            const valA = a[filters.sortBy];
            const valB = b[filters.sortBy];
            if (typeof valA === 'string') {
              return filters.order === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
            }
            return filters.order === 'asc' ? valA - valB : valB - valA;
          });
        }

        // Calculate Pagination
        const total = aggregated.length;
        const pages = Math.max(1, Math.ceil(total / pageSize));
        const startIndex = (page - 1) * pageSize;
        const sliced = aggregated.slice(startIndex, startIndex + pageSize);

        setProducts(sliced);
        setTotalProducts(total);
        setTotalPages(pages);
        
        // Mark source info
        const hasMock = results.some(r => r.source === 'mock');
        setSourceInfo(hasMock ? 'Simulated Aggregator' : 'Live Multi-Platform Aggregator');
      } else {
        // Query single company
        const res = await apiService.getProducts({
          company: filters.company,
          category: filters.category,
          top: 40,
          minPrice: filters.minPrice || 1,
          maxPrice: filters.maxPrice || 100000,
          sortBy: filters.sortBy,
          order: filters.order
        });

        let filtered = res.products || [];

        // Apply Local filters that standard API doesn't support or fits client-side
        if (filters.minRating > 1) {
          filtered = filtered.filter(p => p.rating >= filters.minRating);
        }
        if (filters.onlyInStock) {
          filtered = filtered.filter(p => p.availability === 'yes');
        }
        if (searchQuery.trim()) {
          filtered = filtered.filter(p => 
            p.productName.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }

        // Local Pagination
        const total = filtered.length;
        const pages = Math.max(1, Math.ceil(total / pageSize));
        const startIndex = (page - 1) * pageSize;
        const sliced = filtered.slice(startIndex, startIndex + pageSize);

        setProducts(sliced);
        setTotalProducts(total);
        setTotalPages(pages);
        setSourceInfo(res.source === 'mock' ? 'Simulated Single Client' : `Live API (${filters.company})`);
      }
    } catch (err) {
      console.error(err);
      setError('Could not complete retrieval. Verify credentials or use local demo mode.');
    } finally {
      setLoading(false);
    }
  }, [filters, page, searchQuery]);

  // Query products when filters, search query, or page modifications occur
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Adjust page boundaries if total pages shrinks
  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [totalPages, page]);

  const getCompanyColor = (company) => {
    switch (company) {
      case 'AMZ': return styles.amz;
      case 'FLP': return styles.flp;
      case 'MYN': return styles.myn;
      case 'SNP': return styles.snp;
      case 'AZO': return styles.azo;
      default: return '';
    }
  };

  const getCompanyLogoName = (company) => {
    switch (company) {
      case 'AMZ': return 'Amazon';
      case 'FLP': return 'Flipkart';
      case 'MYN': return 'Myntra';
      case 'SNP': return 'Snapdeal';
      case 'AZO': return 'Azone';
      default: return company;
    }
  };

  return (
    <div className={`${styles.container} animate-fade-in`}>
      <div className={styles.layout}>
        {/* Filter Sidebar */}
        <Sidebar 
          filters={filters} 
          onFilterChange={handleFilterChange} 
          onReset={handleReset} 
        />

        {/* Content Area */}
        <main className={styles.mainContent}>
          {/* Header Actions */}
          <div className={styles.header}>
            <div className={styles.searchWrapper}>
              <Search className={styles.searchIcon} size={18} />
              <input
                type="text"
                placeholder={`Search ${filters.category}s by name...`}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                className={styles.searchInput}
              />
            </div>

            {/* Layout Toggle Group */}
            <div className={`glass ${styles.toggleGroup}`}>
              <button 
                className={`${styles.toggleBtn} ${viewMode === 'grid' ? styles.activeToggle : ''}`}
                onClick={() => setViewMode('grid')}
                title="Grid View"
              >
                <Grid size={18} />
              </button>
              <button 
                className={`${styles.toggleBtn} ${viewMode === 'table' ? styles.activeToggle : ''}`}
                onClick={() => setViewMode('table')}
                title="Table List View"
              >
                <List size={18} />
              </button>
            </div>
            
            {/* Status Information */}
            <div className={`glass ${styles.sourceStatus}`}>
              <Database size={14} className={styles.dbIcon} />
              <span>Source: <strong>{sourceInfo}</strong></span>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className={styles.errorCard}>
              <p>{error}</p>
              <button onClick={fetchProducts} className="premium-btn premium-btn-primary">
                Retry Query
              </button>
            </div>
          )}

          {/* Skeleton Loaders */}
          {loading ? (
            viewMode === 'grid' ? (
              <div className={styles.productGrid}>
                {[...Array(8)].map((_, i) => (
                  <div key={i} className={`glass ${styles.skeletonCard}`}>
                    <div className={styles.skeletonImage}></div>
                    <div className={styles.skeletonBody}>
                      <div className={styles.skeletonTitle}></div>
                      <div className={styles.skeletonText}></div>
                      <div className={styles.skeletonTextShort}></div>
                      <div className={styles.skeletonFooter}></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={`glass ${styles.tableCard}`}>
                <div className={styles.skeletonTableHeader}></div>
                {[...Array(8)].map((_, i) => (
                  <div key={i} className={styles.skeletonTableRow}></div>
                ))}
              </div>
            )
          ) : products.length > 0 ? (
            <>
              {viewMode === 'grid' ? (
                /* Grid View */
                <div className={styles.productGrid}>
                  {products.map((product) => (
                    <div 
                      key={product.id} 
                      className={`glass ${styles.productCard}`}
                      onClick={() => navigate(`/product/${product.id}`)}
                    >
                      {/* Image Placeholder */}
                      <div className={styles.imageWrapper}>
                        <img 
                          src={product.imagePlaceholder || `https://picsum.photos/seed/${product.id}/600/400`} 
                          alt={product.productName} 
                          loading="lazy"
                          className={styles.productImage}
                        />
                        <span className={styles.discountBadge}>
                          {product.discount}% OFF
                        </span>
                        <span className={`${styles.companyBadge} ${getCompanyColor(product.company)}`}>
                          {getCompanyLogoName(product.company)}
                        </span>
                      </div>

                      {/* Card Body */}
                      <div className={styles.cardBody}>
                        <div className={styles.cardHeader}>
                          <span className={styles.categoryTag}>{product.category}</span>
                          <div className={styles.ratingBox}>
                            <Star size={14} className={styles.starIcon} />
                            <span>{product.rating}</span>
                          </div>
                        </div>
                        
                        <h3 className={styles.productName}>{product.productName}</h3>
                        
                        <div className={styles.priceRow}>
                          <div className={styles.priceCol}>
                            <span className={styles.priceLabel}>Best Price</span>
                            <span className={styles.price}>${product.price}</span>
                          </div>
                          <span className={`${styles.stockBadge} ${product.availability === 'yes' ? styles.inStock : styles.outOfStock}`}>
                            {product.availability === 'yes' ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </div>

                        <div className={styles.hoverOverlay}>
                          <Eye size={18} />
                          <span>View Specifications</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Table / List View */
                <div className={`glass ${styles.tableCard} animate-fade-in`}>
                  <div className={styles.tableResponsive}>
                    <table className={styles.comparisonTable}>
                      <thead>
                        <tr>
                          <th>Platform</th>
                          <th>Product Name</th>
                          <th>Rating</th>
                          <th>Discount</th>
                          <th>Price</th>
                          <th>Status</th>
                          <th style={{ textAlign: 'center' }}>Details</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((product) => (
                          <tr key={product.id} onClick={() => navigate(`/product/${product.id}`)}>
                            <td>
                              <span className={`${styles.tableCompanyBadge} ${getCompanyColor(product.company)}`}>
                                {getCompanyLogoName(product.company)}
                              </span>
                            </td>
                            <td className={styles.tableNameCell}>
                              <strong>{product.productName}</strong>
                            </td>
                            <td>
                              <div className={styles.tableRatingBox}>
                                <Star size={14} className={styles.starIcon} />
                                <span>{product.rating}</span>
                              </div>
                            </td>
                            <td>
                              <span className={styles.tableDiscountBadge}>
                                {product.discount}% OFF
                              </span>
                            </td>
                            <td className={styles.tablePriceCell}>
                              ${product.price}
                            </td>
                            <td>
                              <span className={`${styles.stockBadge} ${product.availability === 'yes' ? styles.inStock : styles.outOfStock}`}>
                                {product.availability === 'yes' ? 'In Stock' : 'Out of Stock'}
                              </span>
                            </td>
                            <td style={{ textAlign: 'center' }}>
                              <button 
                                className={styles.tableActionBtn}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/product/${product.id}`);
                                }}
                                aria-label="View specifications"
                              >
                                <Eye size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Pagination Section */}
              <div className={styles.pagination}>
                <button 
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className={styles.pageBtn}
                  aria-label="Previous Page"
                >
                  <ChevronLeft size={18} />
                </button>
                
                <div className={styles.pageIndicators}>
                  {[...Array(totalPages)].map((_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`${styles.indicatorBtn} ${page === pageNum ? styles.activeIndicator : ''}`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button 
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className={styles.pageBtn}
                  aria-label="Next Page"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </>
          ) : (
            /* Empty State */
            <div className={`glass ${styles.emptyCard}`}>
              <ShoppingBag size={48} className={styles.emptyIcon} />
              <h3>No Products Found</h3>
              <p>We couldn't find any products matching your active filters. Try broadening your search or adjusting your price limits.</p>
              <button onClick={handleReset} className="premium-btn premium-btn-primary">
                Reset All Filters
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
