'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import ProductCard from '@/app/components/ProductCard';
import { Search, Grid3X3, List, SlidersHorizontal, X } from 'lucide-react';

interface Product {
  _id: string;
  title: string;
  price: number;
  priceAfterDiscount?: number;
  imageCover: string;
  ratingsAverage: number;
  ratingsQuantity: number;
  quantity: number;
  category: {
    _id: string;
    name: string;
  };
  brand: {
    _id: string;
    name: string;
  };
}

interface Category {
  _id: string;
  name: string;
}

interface Brand {
  _id: string;
  name: string;
}

export default function SearchResultsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || '';

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter states
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('relevance');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Search input state
  const [searchInput, setSearchInput] = useState(query);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setSearchInput(query);
  }, [query]);

  useEffect(() => {
    applyFilters();
  }, [allProducts, query, selectedCategories, selectedBrands, minPrice, maxPrice, sortBy]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch all data
      const [productsRes, categoriesRes, brandsRes] = await Promise.all([
        fetch('https://ecommerce.routemisr.com/api/v1/products'),
        fetch('https://ecommerce.routemisr.com/api/v1/categories'),
        fetch('https://ecommerce.routemisr.com/api/v1/brands')
      ]);

      const productsData = await productsRes.json();
      const categoriesData = await categoriesRes.json();
      const brandsData = await brandsRes.json();

      setAllProducts(productsData.data || []);
      setCategories(categoriesData.data || []);
      setBrands(brandsData.data || []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let results = [...allProducts];

    // Search filter
    if (query) {
      results = results.filter(product =>
        product.title.toLowerCase().includes(query.toLowerCase()) ||
        product.category.name.toLowerCase().includes(query.toLowerCase()) ||
        product.brand.name.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategories.length > 0) {
      results = results.filter(product =>
        selectedCategories.includes(product.category._id)
      );
    }

    // Brand filter
    if (selectedBrands.length > 0) {
      results = results.filter(product =>
        selectedBrands.includes(product.brand._id)
      );
    }

    // Price filter
    if (minPrice) {
      results = results.filter(product =>
        (product.priceAfterDiscount || product.price) >= parseFloat(minPrice)
      );
    }
    if (maxPrice) {
      results = results.filter(product =>
        (product.priceAfterDiscount || product.price) <= parseFloat(maxPrice)
      );
    }

    // Sorting
    switch (sortBy) {
      case 'price-low':
        results.sort((a, b) => 
          (a.priceAfterDiscount || a.price) - (b.priceAfterDiscount || b.price)
        );
        break;
      case 'price-high':
        results.sort((a, b) => 
          (b.priceAfterDiscount || b.price) - (a.priceAfterDiscount || a.price)
        );
        break;
      case 'rating':
        results.sort((a, b) => b.ratingsAverage - a.ratingsAverage);
        break;
      case 'newest':
        // Assuming _id contains timestamp info (MongoDB ObjectId)
        results.sort((a, b) => b._id.localeCompare(a._id));
        break;
      default:
        // Relevance - already filtered by search
        break;
    }

    setFilteredProducts(results);
  };

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleBrandToggle = (brandId: string) => {
    setSelectedBrands(prev =>
      prev.includes(brandId)
        ? prev.filter(id => id !== brandId)
        : [...prev, brandId]
    );
  };

  const handlePriceRangeClick = (min: string, max: string) => {
    setMinPrice(min);
    setMaxPrice(max);
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setMinPrice('');
    setMaxPrice('');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  const activeFiltersCount = selectedCategories.length + selectedBrands.length + (minPrice ? 1 : 0) + (maxPrice ? 1 : 0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Searching...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-green-600">Home</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">Search Results</span>
          </nav>
        </div>
      </div>

      {/* Search Bar Section */}
      <div className="bg-white border-b border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4">
          <form onSubmit={handleSearchSubmit} className="max-w-2xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none text-lg"
              />
            </div>
          </form>

          <div className="mt-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Search Results for &quot;{query}&quot;
            </h1>
            <p className="text-gray-600 mt-1">
              We found {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} for you
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-80 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-24">
              {/* Filter Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Filters</h3>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-green-600 hover:text-green-700 font-semibold"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {/* Active Filters */}
              {activeFiltersCount > 0 && (
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-3">Active Filters</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedCategories.map(catId => {
                      const cat = categories.find(c => c._id === catId);
                      return (
                        <button
                          key={catId}
                          onClick={() => handleCategoryToggle(catId)}
                          className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium hover:bg-green-200 transition-colors"
                        >
                          {cat?.name}
                          <X className="w-3 h-3" />
                        </button>
                      );
                    })}
                    {selectedBrands.map(brandId => {
                      const brand = brands.find(b => b._id === brandId);
                      return (
                        <button
                          key={brandId}
                          onClick={() => handleBrandToggle(brandId)}
                          className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors"
                        >
                          {brand?.name}
                          <X className="w-3 h-3" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="space-y-6 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
                {/* Categories Filter */}
                <div>
                  <h4 className="font-bold text-gray-900 mb-3">Categories</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {categories.map(category => (
                      <label key={category._id} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category._id)}
                          onChange={() => handleCategoryToggle(category._id)}
                          className="w-4 h-4 text-green-500 border-gray-300 rounded focus:ring-green-500"
                        />
                        <span className="text-sm text-gray-700">{category.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range Filter */}
                <div className="pt-6 border-t border-gray-200">
                  <h4 className="font-bold text-gray-900 mb-3">Price Range</h4>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="text-xs text-gray-600 mb-1 block">Min (EGP)</label>
                      <input
                        type="number"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        placeholder="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-green-500 outline-none text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600 mb-1 block">Max (EGP)</label>
                      <input
                        type="number"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        placeholder="No limit"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-green-500 outline-none text-sm"
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handlePriceRangeClick('0', '500')}
                      className="px-3 py-1 border border-gray-300 rounded-lg text-xs hover:border-green-500 hover:bg-green-50 transition-colors"
                    >
                      Under 500
                    </button>
                    <button
                      onClick={() => handlePriceRangeClick('0', '1000')}
                      className="px-3 py-1 border border-gray-300 rounded-lg text-xs hover:border-green-500 hover:bg-green-50 transition-colors"
                    >
                      Under 1K
                    </button>
                    <button
                      onClick={() => handlePriceRangeClick('0', '5000')}
                      className="px-3 py-1 border border-gray-300 rounded-lg text-xs hover:border-green-500 hover:bg-green-50 transition-colors"
                    >
                      Under 5K
                    </button>
                    <button
                      onClick={() => handlePriceRangeClick('0', '10000')}
                      className="px-3 py-1 border border-gray-300 rounded-lg text-xs hover:border-green-500 hover:bg-green-50 transition-colors"
                    >
                      Under 10K
                    </button>
                  </div>
                </div>

                {/* Brands Filter */}
                <div className="pt-6 border-t border-gray-200">
                  <h4 className="font-bold text-gray-900 mb-3">Brands</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {brands.map(brand => (
                      <label key={brand._id} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes(brand._id)}
                          onChange={() => handleBrandToggle(brand._id)}
                          className="w-4 h-4 text-green-500 border-gray-300 rounded focus:ring-green-500"
                        />
                        <span className="text-sm text-gray-700">{brand.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowMobileFilters(true)}
                    className="lg:hidden flex items-center gap-2 px-4 py-2 border-2 border-gray-300 rounded-xl font-semibold hover:border-green-500 transition-colors"
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                    Filters
                    {activeFiltersCount > 0 && (
                      <span className="px-2 py-0.5 bg-green-500 text-white text-xs rounded-full">
                        {activeFiltersCount}
                      </span>
                    )}
                  </button>

                  <div className="text-sm text-gray-600">
                    <span className="font-bold text-gray-900">{filteredProducts.length}</span> Results
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  {/* View Mode Toggle */}
                  <div className="hidden sm:flex bg-gray-100 p-1 rounded-xl border border-gray-200">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Sort Dropdown */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="flex-1 sm:flex-initial px-4 py-2 border border-gray-300 rounded-xl outline-none focus:border-green-500 text-sm font-medium"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                    <option value="newest">Newest</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Products Grid/List */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No Products Found</h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search or filters to find what you&apos;re looking for.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-3 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className={`grid ${viewMode === 'grid' ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'} gap-4 md:gap-6`}>
                {filteredProducts.map(product => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Sidebar */}
      {showMobileFilters && (
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] lg:hidden"
            onClick={() => setShowMobileFilters(false)}
          ></div>

          <div className="fixed top-0 left-0 h-full w-80 bg-white z-[70] lg:hidden overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-bold">Filters</h3>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Same filter content as desktop sidebar */}
              {activeFiltersCount > 0 && (
                <div className="pb-6 border-b border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-semibold text-gray-500 uppercase">Active</p>
                    <button
                      onClick={clearAllFilters}
                      className="text-sm text-green-600 hover:text-green-700 font-semibold"
                    >
                      Clear all
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedCategories.map(catId => {
                      const cat = categories.find(c => c._id === catId);
                      return (
                        <button
                          key={catId}
                          onClick={() => handleCategoryToggle(catId)}
                          className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium"
                        >
                          {cat?.name}
                          <X className="w-3 h-3" />
                        </button>
                      );
                    })}
                    {selectedBrands.map(brandId => {
                      const brand = brands.find(b => b._id === brandId);
                      return (
                        <button
                          key={brandId}
                          onClick={() => handleBrandToggle(brandId)}
                          className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                        >
                          {brand?.name}
                          <X className="w-3 h-3" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Categories */}
              <div>
                <h4 className="font-bold text-gray-900 mb-3">Categories</h4>
                <div className="space-y-2">
                  {categories.map(category => (
                    <label key={category._id} className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-50 rounded-lg">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category._id)}
                        onChange={() => handleCategoryToggle(category._id)}
                        className="w-4 h-4 text-green-500 border-gray-300 rounded focus:ring-green-500"
                      />
                      <span className="text-sm text-gray-700">{category.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="pt-6 border-t border-gray-200">
                <h4 className="font-bold text-gray-900 mb-3">Price Range</h4>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="text-xs text-gray-600 mb-1 block">Min (EGP)</label>
                    <input
                      type="number"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      placeholder="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-green-500 outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600 mb-1 block">Max (EGP)</label>
                    <input
                      type="number"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      placeholder="No limit"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-green-500 outline-none text-sm"
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handlePriceRangeClick('0', '500')}
                    className="px-3 py-1 border border-gray-300 rounded-lg text-xs hover:border-green-500 hover:bg-green-50"
                  >
                    Under 500
                  </button>
                  <button
                    onClick={() => handlePriceRangeClick('0', '1000')}
                    className="px-3 py-1 border border-gray-300 rounded-lg text-xs hover:border-green-500 hover:bg-green-50"
                  >
                    Under 1K
                  </button>
                  <button
                    onClick={() => handlePriceRangeClick('0', '5000')}
                    className="px-3 py-1 border border-gray-300 rounded-lg text-xs hover:border-green-500 hover:bg-green-50"
                  >
                    Under 5K
                  </button>
                  <button
                    onClick={() => handlePriceRangeClick('0', '10000')}
                    className="px-3 py-1 border border-gray-300 rounded-lg text-xs hover:border-green-500 hover:bg-green-50"
                  >
                    Under 10K
                  </button>
                </div>
              </div>

              {/* Brands */}
              <div className="pt-6 border-t border-gray-200">
                <h4 className="font-bold text-gray-900 mb-3">Brands</h4>
                <div className="space-y-2">
                  {brands.map(brand => (
                    <label key={brand._id} className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-50 rounded-lg">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand._id)}
                        onChange={() => handleBrandToggle(brand._id)}
                        className="w-4 h-4 text-green-500 border-gray-300 rounded focus:ring-green-500"
                      />
                      <span className="text-sm text-gray-700">{brand.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6">
              <button
                onClick={() => setShowMobileFilters(false)}
                className="w-full py-3 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition-colors"
              >
                Show {filteredProducts.length} Results
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}