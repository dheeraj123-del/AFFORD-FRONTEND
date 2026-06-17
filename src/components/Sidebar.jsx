import React from 'react';
import { Filter, RotateCcw, Building2, Tag, DollarSign, Star, CheckSquare, Square, ArrowDownUp } from 'lucide-react';
import { COMPANIES, CATEGORIES } from '../services/api';
import styles from './Sidebar.module.css';

export default function Sidebar({ filters, onFilterChange, onReset }) {
  const handleCompanyChange = (company) => {
    onFilterChange('company', company);
  };

  const handleCategoryChange = (category) => {
    onFilterChange('category', category);
  };

  const handlePriceChange = (field, value) => {
    const val = value === '' ? '' : parseInt(value);
    onFilterChange(field, val);
  };

  const toggleAvailability = () => {
    onFilterChange('onlyInStock', !filters.onlyInStock);
  };

  return (
    <aside className={`glass ${styles.sidebar}`}>
      <div className={styles.header}>
        <div className={styles.title}>
          <Filter size={18} className={styles.filterIcon} />
          <h2>Filter Products</h2>
        </div>
        <button className={styles.resetBtn} onClick={onReset} title="Reset all filters">
          <RotateCcw size={14} />
          <span>Reset</span>
        </button>
      </div>

      <div className={styles.sectionContainer}>
        {/* Company Selector */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>
            <Building2 size={16} />
            <h3>Platform Source</h3>
          </div>
          <div className={styles.companyOptions}>
            <button
              className={`${styles.companyBtn} ${filters.company === 'ALL' ? styles.companyBtnActive : ''}`}
              onClick={() => handleCompanyChange('ALL')}
            >
              All Platforms
            </button>
            {COMPANIES.map((comp) => (
              <button
                key={comp}
                className={`${styles.companyBtn} ${filters.company === comp ? styles.companyBtnActive : ''}`}
                onClick={() => handleCompanyChange(comp)}
              >
                {comp}
              </button>
            ))}
          </div>
        </div>

        {/* Category Selector */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>
            <Tag size={16} />
            <h3>Category</h3>
          </div>
          <select 
            value={filters.category} 
            onChange={(e) => handleCategoryChange(e.target.value)}
            className={styles.selectInput}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>
            <DollarSign size={16} />
            <h3>Price Range ($)</h3>
          </div>
          <div className={styles.priceInputs}>
            <div className={styles.priceField}>
              <label>Min</label>
              <input
                type="number"
                placeholder="Min"
                value={filters.minPrice}
                onChange={(e) => handlePriceChange('minPrice', e.target.value)}
                min="0"
              />
            </div>
            <div className={styles.priceField}>
              <label>Max</label>
              <input
                type="number"
                placeholder="Max"
                value={filters.maxPrice}
                onChange={(e) => handlePriceChange('maxPrice', e.target.value)}
                min="0"
              />
            </div>
          </div>
        </div>

        {/* Rating Filter */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>
            <Star size={16} />
            <h3>Minimum Rating</h3>
          </div>
          <div className={styles.ratingSliderContainer}>
            <input
              type="range"
              min="1"
              max="5"
              step="0.5"
              value={filters.minRating}
              onChange={(e) => onFilterChange('minRating', parseFloat(e.target.value))}
              className={styles.rangeInput}
            />
            <div className={styles.ratingLabels}>
              <span>1★</span>
              <span className={styles.currentRating}>{filters.minRating} ★ & above</span>
              <span>5★</span>
            </div>
          </div>
        </div>

        {/* Availability Toggle */}
        <div className={styles.section}>
          <button className={styles.checkboxWrapper} onClick={toggleAvailability}>
            {filters.onlyInStock ? (
              <CheckSquare className={styles.checkedIcon} size={20} />
            ) : (
              <Square className={styles.uncheckedIcon} size={20} />
            )}
            <span className={styles.checkboxLabel}>Show In-Stock Only</span>
          </button>
        </div>

        {/* Sorting options */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>
            <ArrowDownUp size={16} />
            <h3>Sort Products</h3>
          </div>
          <select 
            value={`${filters.sortBy}-${filters.order}`} 
            onChange={(e) => {
              const [sortBy, order] = e.target.value.split('-');
              onFilterChange('sortBy', sortBy);
              onFilterChange('order', order);
            }}
            className={styles.selectInput}
          >
            <option value="-">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating-desc">Rating: High to Low</option>
            <option value="discount-desc">Discount: High to Low</option>
          </select>
        </div>
      </div>
    </aside>
  );
}
