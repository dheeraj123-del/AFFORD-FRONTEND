import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Heart, Share2, ShieldCheck, Truck, RefreshCw, ShoppingCart } from 'lucide-react';
import { apiService } from '../services/api';
import styles from './ProductDetail.module.css';

const MOCK_REVIEWS = [
  { name: "Sarah Connor", rating: 5, date: "May 12, 2026", comment: "Absolutely incredible! Exceeded all my expectations. The build quality is exceptional and performance is blazing fast." },
  { name: "John Doe", rating: 4, date: "June 01, 2026", comment: "Great value for the price. The discount made this a no-brainer purchase. Battery life is fantastic." },
  { name: "Elena Rostova", rating: 5, date: "June 14, 2026", comment: "Stunning design and very comfortable to use. Highly recommend to anyone looking for a top-tier model in this category." }
];

export default function ProductDetail() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      const res = await apiService.getProductById(productId);
      setProduct(res);
      setLoading(false);
    };
    fetchDetail();
  }, [productId]);

  const getCompanyLogoName = (company) => {
    switch (company) {
      case 'AMZ': return 'Amazon Store';
      case 'FLP': return 'Flipkart Exclusive';
      case 'MYN': return 'Myntra Fashion';
      case 'SNP': return 'Snapdeal Direct';
      case 'AZO': return 'Azone Hub';
      default: return company;
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading product specifications...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className={styles.errorContainer}>
        <h2>Product Not Found</h2>
        <p>We couldn't retrieve the specifications for the product ID: <strong>{productId}</strong>.</p>
        <button onClick={() => navigate('/dashboard')} className="premium-btn premium-btn-primary">
          Back to Dashboard
        </button>
      </div>
    );
  }

  const originalPrice = Math.round(product.price / (1 - product.discount / 100));

  return (
    <div className={`${styles.container} animate-fade-in`}>
      {/* Back Link */}
      <button onClick={() => navigate('/dashboard')} className={styles.backBtn}>
        <ArrowLeft size={16} />
        <span>Back to Dashboard</span>
      </button>

      <div className={styles.grid}>
        {/* Left Column: Product Image Gallery */}
        <div className={styles.gallery}>
          <div className={`glass ${styles.imageWrapper}`}>
            <img 
              src={product.imagePlaceholder || `https://picsum.photos/seed/${product.id}/800/600`} 
              alt={product.productName} 
              className={styles.mainImage}
            />
            <button 
              className={`${styles.favoriteBtn} ${isFavorite ? styles.favorited : ''}`}
              onClick={() => setIsFavorite(!isFavorite)}
              aria-label="Add to wishlist"
            >
              <Heart size={20} fill={isFavorite ? 'var(--danger)' : 'transparent'} />
            </button>
          </div>
        </div>

        {/* Right Column: Product Specs and Actions */}
        <div className={styles.details}>
          <div className={styles.header}>
            <span className={styles.companyBadge}>{getCompanyLogoName(product.company)}</span>
            <span className={styles.categoryBadge}>{product.category}</span>
          </div>

          <h1 className={styles.title}>{product.productName}</h1>

          {/* Rating Summary */}
          <div className={styles.ratingRow}>
            <div className={styles.stars}>
              {[...Array(5)].map((_, i) => {
                const isFull = i < Math.floor(product.rating);
                return (
                  <Star 
                    key={i} 
                    size={16} 
                    className={isFull ? styles.starFilled : styles.starEmpty}
                    fill={isFull ? 'var(--warning)' : 'transparent'}
                  />
                );
              })}
            </div>
            <span className={styles.ratingVal}>{product.rating} / 5.0</span>
            <span className={styles.divider}>|</span>
            <span className={styles.reviewsCount}>{product.reviewsCount} verified reviews</span>
          </div>

          {/* Price Box */}
          <div className={`glass ${styles.priceBox}`}>
            <div className={styles.priceRow}>
              <span className={styles.salePrice}>${product.price}</span>
              <span className={styles.originalPrice}>${originalPrice}</span>
              <span className={styles.discountBadge}>{product.discount}% OFF</span>
            </div>
            <p className={styles.priceInfo}>Inclusive of all mock tariffs and regional shipping credits.</p>
          </div>

          {/* Availability & Brief Specs */}
          <div className={styles.metaList}>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Availability:</span>
              <span className={`${styles.statusVal} ${product.availability === 'yes' ? styles.inStock : styles.outOfStock}`}>
                {product.availability === 'yes' ? 'In Stock (Ready to dispatch)' : 'Out of Stock'}
              </span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Product Reference ID:</span>
              <code className={styles.refCode}>{product.id}</code>
            </div>
          </div>

          {/* Description */}
          <div className={styles.infoSection}>
            <h3>Product Overview</h3>
            <p>{product.description}</p>
          </div>

          {/* Specifications Checklist */}
          <div className={styles.infoSection}>
            <h3>Technical Specifications</h3>
            <ul className={styles.specsList}>
              {product.specs.map((spec, index) => (
                <li key={index} className={styles.specItem}>
                  <span className={styles.bullet}>&middot;</span>
                  <span>{spec}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Value Props */}
          <div className={styles.valueProps}>
            <div className={styles.prop}>
              <Truck size={20} className={styles.propIcon} />
              <div>
                <h4>Free Mock Delivery</h4>
                <p>Arrives in 2-3 business days</p>
              </div>
            </div>
            <div className={styles.prop}>
              <RefreshCw size={20} className={styles.propIcon} />
              <div>
                <h4>30-Day Simulated Return</h4>
                <p>Easy returns with fake refunds</p>
              </div>
            </div>
          </div>

          {/* Purchase Trigger (Mock CTA) */}
          <button className={`premium-btn premium-btn-primary ${styles.buyBtn}`} disabled={product.availability !== 'yes'}>
            <ShoppingCart size={18} />
            <span>{product.availability === 'yes' ? 'Add to Mock Cart' : 'Item Unavailable'}</span>
          </button>
        </div>
      </div>

      {/* Review Section */}
      <section className={`glass ${styles.reviewsSection}`}>
        <h2>Customer Feedback</h2>
        <div className={styles.reviewsList}>
          {MOCK_REVIEWS.map((rev, index) => (
            <div key={index} className={styles.reviewCard}>
              <div className={styles.reviewHeader}>
                <span className={styles.reviewerName}>{rev.name}</span>
                <span className={styles.reviewDate}>{rev.date}</span>
              </div>
              <div className={styles.reviewStars}>
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={14} 
                    className={i < rev.rating ? styles.starFilled : styles.starEmpty}
                    fill={i < rev.rating ? 'var(--warning)' : 'transparent'}
                  />
                ))}
              </div>
              <p className={styles.reviewComment}>{rev.comment}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
