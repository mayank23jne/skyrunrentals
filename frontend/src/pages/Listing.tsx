import React from 'react';
import { useSearchParams, useParams, useLocation } from 'react-router-dom';
import { useInfiniteQuery } from '@tanstack/react-query';
import api, { API_BASE_URL } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PropertyCard from '../components/PropertyCard';
import SearchBar from '../components/SearchBar';
import FilterSidebar from '../components/FilterSidebar';
import { useCurrency } from '../context/CurrencyContext';
import { motion } from 'framer-motion';
import { PulseLoader } from 'react-spinners';

const Listing: React.FC = () => {
  const { propertyId } = useParams<{ propertyId?: string }>();
  const location = useLocation();
  const isCityRoute = location.pathname.includes('/listing/cities/');

  let venue_type: string | undefined = undefined;
  if (location.pathname.includes('/listing/cities/')) venue_type = 'cities';
  else if (location.pathname.includes('/listing/states/')) venue_type = 'states';
  else if (location.pathname.includes('/listing/countries/')) venue_type = 'countries';

  const venue_id = propertyId;

  const [searchParams] = useSearchParams();
  const venue = searchParams.get('venue') || '';
  const check_in = searchParams.get('check_in') || '';
  const check_out = searchParams.get('check_out') || '';
  const guest = searchParams.get('guest') || '';

  const [filters, setFilters] = React.useState<{
    priceRange: [number, number];
    cities: string[];
    propertyTypes: string[];
    viewTypes: number[];
    bedrooms: number[];
    sleeps: number[];
  }>({
    priceRange: [0, 1000],
    cities: [],
    propertyTypes: [],
    viewTypes: [],
    bedrooms: [],
    sleeps: [],
  });

  const { formatPrice } = useCurrency();

  const {
    data: initialDataRaw,
    isLoading: isInitialLoading,
    fetchNextPage: fetchInitialNextPage,
    hasNextPage: hasInitialNextPage,
    isFetchingNextPage: isFetchingInitialNextPage
  } = useInfiniteQuery({
    queryKey: ['listing-initial', venue, check_in, check_out, guest, venue_id, venue_type],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await api.get('/properties/listing', {
        params: { venue, check_in, check_out, guest, venue_type, venue_id, page: pageParam }
      });
      return response.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage || !lastPage.currentPage || !lastPage.totalPages) return undefined;
      return lastPage.currentPage < lastPage.totalPages ? lastPage.currentPage + 1 : undefined;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  const {
    data: filteredDataRaw,
    isLoading: isFiltering,
    isFetching: isFilteringFetching,
    fetchNextPage: fetchFilteredNextPage,
    hasNextPage: hasFilteredNextPage,
    isFetchingNextPage: isFetchingFilteredNextPage
  } = useInfiniteQuery({
    queryKey: ['listing-filtered', venue, check_in, check_out, guest, filters, venue_id, venue_type],
    queryFn: async ({ pageParam = 1 }) => {
      const isPriceDefault = filters.priceRange[0] === 0 && filters.priceRange[1] === 1000;
      const noOtherFilters = filters.cities.length === 0 && filters.propertyTypes.length === 0 && filters.viewTypes.length === 0 && filters.bedrooms.length === 0 && filters.sleeps.length === 0;

      if (isPriceDefault && noOtherFilters && !venue && !check_in && !check_out && !guest && !venue_id) {
        return null;
      }

      const payload = {
        getamtfrm: filters.priceRange[0],
        getamtto: filters.priceRange[1] === 1000 ? 'All' : filters.priceRange[1],
        city_arr: filters.cities,
        property_type_Array: filters.propertyTypes,
        view_type_Array: filters.viewTypes,
        bed_type_Array: filters.bedrooms,
        sleep_type_Array: filters.sleeps,
        venue: venue || undefined,
        check_in: check_in || undefined,
        check_out: check_out || undefined,
        guests: guest ? parseInt(guest.replace(/\D/g, ''), 10) : undefined,
        venue_type,
        venue_id,
        page: pageParam
      };

      const response = await api.post('/properties/filter', payload);
      return response.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage || !lastPage.currentPage || !lastPage.totalPages) return undefined;
      return lastPage.currentPage < lastPage.totalPages ? lastPage.currentPage + 1 : undefined;
    },
    enabled: !!initialDataRaw,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  const isPriceDefault = filters.priceRange[0] === 0 && filters.priceRange[1] === 1000;
  const noOtherFilters = filters.cities.length === 0 && filters.propertyTypes.length === 0 && filters.viewTypes.length === 0 && filters.bedrooms.length === 0 && filters.sleeps.length === 0;

  const isFilteringActive = !(isPriceDefault && noOtherFilters);

  // Extract initialData metadata for sidebar
  const initialData = initialDataRaw?.pages?.[0];

  const currentRaw = isFilteringActive ? filteredDataRaw : initialDataRaw;
  const flatProperties = currentRaw?.pages?.flatMap((page: any) => page?.properties || []) || [];

  const displayData = {
    ...(currentRaw?.pages?.[0] || {}),
    properties: flatProperties
  };

  const isLoading = isInitialLoading || (isFilteringActive && isFilteringFetching && !isFetchingFilteredNextPage);
  const isFetchingMore = isFilteringActive ? isFetchingFilteredNextPage : isFetchingInitialNextPage;
  const hasMore = isFilteringActive ? hasFilteredNextPage : hasInitialNextPage;
  const loadMore = isFilteringActive ? fetchFilteredNextPage : fetchInitialNextPage;

  const displayDestination = venue || displayData?.properties?.[0]?.[
    venue_type === 'countries' ? 'country' : venue_type === 'cities' ? 'city' : 'state'
  ] || displayData?.properties?.[0]?.state || displayData?.properties?.[0]?.country || '';

  return (
    <div className="listing-page">
      <Navbar />
      <main className="listing-main" style={{ paddingTop: '160px', minHeight: '100vh', background: '#f8fafc' }}>
        <div className="container listing-container">
          <div className="listing-header" style={{ marginBottom: '40px' }}>
            <h1 style={{ fontSize: '32px', fontWeight: 900 }}>
              Search Results {venue && <span>for "{venue}"</span>}
            </h1>
          </div>

          <div style={{ marginBottom: '40px' }}>
            <SearchBar />
            {displayDestination && (
              <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                <div style={{ background: '#fff', border: '1px solid #e2e8f0', padding: '8px 16px', borderRadius: '50px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: '#64748b', fontSize: '14px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Destination:</span>
                  <span style={{ color: '#0f172a', fontSize: '16px', fontWeight: 800 }}>{displayDestination}</span>
                </div>
              </div>
            )}
          </div>

          <div className="listing-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '30px' }}>
            {/* Sidebar */}
            <aside className="listing-sidebar">
              {initialData && (
                <FilterSidebar
                  filters={filters}
                  setFilters={setFilters}
                  availableFilters={{
                    cities: initialData.cities || [],
                    propertyTypes: initialData.property_type || [],
                    viewTypes: initialData.property_view || [],
                  }}
                  hideCityFilter={isCityRoute}
                />
              )}
            </aside>

            {/* Main Content */}
            <div className="main-results">

              <div style={{ position: 'relative', minHeight: '400px' }}>
                {isLoading && (
                  <div style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    zIndex: 10,
                    borderRadius: '12px'
                  }}>
                    <div style={{
                      position: 'sticky',
                      top: '30vh',
                      left: '60%',
                      transform: 'translateX(-50%)',
                      width: '120px',
                      height: '120px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'rgba(255, 255, 255, 0.95)',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                      borderRadius: '20px'
                    }}>
                      <PulseLoader color="#0f172a" size={14} margin={4} />
                      <span style={{ marginTop: '16px', fontSize: '12px', fontWeight: 700, color: '#64748b', letterSpacing: '1px' }}>LOADING</span>
                    </div>
                  </div>
                )}

                {!isLoading && displayData?.properties?.length === 0 ? (
                  <div style={{ textAlign: 'center', paddingTop: '60px', background: 'transparent', borderRadius: '12px' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: 700 }}>No Properties Found</h2>
                    <p style={{ color: '#64748b', marginTop: '12px' }}>Try adjusting your search filters to find more properties.</p>
                  </div>
                ) : (
                  <>
                    <div className="properties-grid" style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                      gap: '30px',
                      opacity: isLoading ? 0.5 : 1,
                      transition: 'opacity 0.3s'
                    }}>
                      {displayData?.properties?.map((property: any) => (
                        <motion.div
                          key={property.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <PropertyCard
                            id={property.id}
                            image={property.photos?.[0]?.imageName || ''}
                            images={property.photos?.map((p: any) => p.imageName) || []}
                            title={property.propertyHeadline || 'Property Name'}
                            location={`${property.city || ''}, ${property.country || ''}`.replace(/^, | , $/g, '') || 'Location'}
                            price={formatPrice(property.rates?.[0]?.nightly || 0)}
                            rating={4.8}
                            beds={property.bedroom || 0}
                            baths={property.bathroom || 0}
                            guests={property.sleeps || 0}
                            propertyDescription={property.propertyDescription || property.property_description || ''}
                          />
                        </motion.div>
                      ))}
                    </div>

                    <div style={{ textAlign: 'center', marginTop: '40px', paddingBottom: '40px' }}>
                      {!isLoading && displayData && (
                        <div style={{ marginBottom: '20px', color: '#64748b', fontSize: '15px', lineHeight: '1.6' }}>
                          Showing <span style={{ fontWeight: 700, color: '#0f172a' }}>{displayData?.properties?.length || 0}</span> Properties<br />
                          Total Properties Found - <span style={{ fontWeight: 700, color: '#0f172a' }}>{displayData?.totalPropertiesinfilter ?? displayData?.totalCount ?? 0}</span>
                        </div>
                      )}

                      {hasMore && (
                        <button
                          onClick={() => loadMore()}
                          disabled={isFetchingMore}
                          style={{
                            padding: '12px 32px',
                            background: isFetchingMore ? '#e2e8f0' : '#0f172a',
                            color: isFetchingMore ? '#64748b' : 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '16px',
                            fontWeight: 600,
                            cursor: isFetchingMore ? 'not-allowed' : 'pointer',
                            transition: 'all 0.3s ease',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}
                        >
                          {isFetchingMore ? 'Loading...' : 'Load More Properties'}
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @media (max-width: 1024px) {
          .listing-layout { grid-template-columns: 1fr !important; }
          .properties-grid { grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)) !important; }
        }
        @media (max-width: 768px) {
          .listing-main { padding-top: 100px !important; }
          .listing-container { padding: 0 15px !important; }
          .listing-header { margin-bottom: 20px !important; }
          .listing-header h1 { font-size: 24px !important; }
        }
      `}} />
    </div>
  );
};

export default Listing;
