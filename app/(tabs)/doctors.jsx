import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import CommonHeader from '../../components/CommonHeader';
import ApiService from '../../services/api';

export default function DoctorsScreen() {
  const params = useLocalSearchParams();
  const { specialtyId, specialtyName } = params;
  
  console.log('DoctorsScreen URL params:', { specialtyId, specialtyName, params });
  
  
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [specializations, setSpecializations] = useState([]);
  const [imageErrors, setImageErrors] = useState({});
  const [imageLoaded, setImageLoaded] = useState({});
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const hasAutoSelected = useRef(false);
  const lastSpecialtyId = useRef(null);


  // Fetch doctors and specializations on component mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const response = await ApiService.getSpecializations();
        if (response.success && response.data.status) {
          const mappedSpecializations = response.data.data.map(spec => ({
            id: spec.specialization_id || spec.id,
            name: spec.name || spec.specialization_name || spec.title
          }));
          let allSpecializations = [{ id: null, name: 'All' }, ...mappedSpecializations];
          
          // If there's a specialtyId from URL, move that specialty to the front
          if (specialtyId) {
            const selectedIndex = allSpecializations.findIndex(s => s.id === parseInt(specialtyId));
            if (selectedIndex > 0) { // Don't move "All" (index 0)
              const selectedSpecialty = allSpecializations[selectedIndex];
              // Create new array with selected specialty first (after "All")
              allSpecializations = [
                allSpecializations[0], // Keep "All" first
                selectedSpecialty,     // Selected specialty second
                ...allSpecializations.slice(1).filter((_, index) => index !== selectedIndex - 1)
              ];
              console.log('Moved selected specialty to front:', selectedSpecialty.name);
            }
          }
          
          setSpecializations(allSpecializations);
        }
      } catch (error) {
        // Handle error silently
      }

      // Load initial doctors - only if no specialty filtering is expected
      if (!specialtyId) {
        try {
          setLoading(true);
          const limit = 10;
          const response = await ApiService.getDoctors(limit, 1, null);
          
          if (response.success && response.data.status) {
            let doctorsList = response.data.data || [];
            setDoctors(doctorsList);
            setHasMore(doctorsList.length === limit);
            setPage(1);
            setImageErrors({});
            setImageLoaded({});
          }
        } catch (error) {
          // Handle error silently
        } finally {
          setLoading(false);
        }
      }
    };

    loadInitialData();
  }, [specialtyId]);

  // Handle initial specialty selection from URL parameters - Reset on specialtyId change
  useEffect(() => {
    // Reset the flag if specialtyId changes (including when it becomes null/undefined)
    if (lastSpecialtyId.current !== specialtyId) {
      const prevId = lastSpecialtyId.current;
      hasAutoSelected.current = false;
      lastSpecialtyId.current = specialtyId;
      console.log('SpecialtyId changed from', prevId, 'to', specialtyId, '- resetting filter');
    }
    
    if (specialtyId && specializations.length > 0 && !hasAutoSelected.current) {
      console.log('Filtering by specialtyId:', specialtyId, 'Available specializations:', specializations.map(s => ({id: s.id, name: s.name})));
      const selectedSpecialty = specializations.find(s => s.id === parseInt(specialtyId));
      console.log('Found selectedSpecialty:', selectedSpecialty);
      
      hasAutoSelected.current = true;
      
      const loadFilteredDoctors = async () => {
        try {
          setLoading(true);
          const limit = 10;
          let filterSpecialtyId = null;
          let filterName = 'All';
          
          // If specialty exists, use it for filtering
          if (selectedSpecialty) {
            filterSpecialtyId = parseInt(specialtyId);
            filterName = selectedSpecialty.name;
            console.log('Using specialty filter:', filterName, 'ID:', filterSpecialtyId);
          } else if (specialtyName) {
            // Fallback: use the specialty name from URL even if ID doesn't match
            // This shows all doctors but displays the intended specialty name
            console.log('Specialty ID not found, using name from URL:', specialtyName);
            filterName = specialtyName;
          } else {
            console.log('Specialty not found, showing all doctors');
          }
          
          setSelectedFilter(filterName);
          setPage(1);
          setDoctors([]);
          
          console.log('Making API call with filterSpecialtyId:', filterSpecialtyId);
          const response = await ApiService.getDoctors(limit, 1, filterSpecialtyId);
          
          console.log('RAW API Response:', JSON.stringify(response, null, 2));
          
          if (response.success && response.data.status) {
            let doctorsList = response.data.data || [];
            console.log('Received doctors:', doctorsList.length);
            console.log('All doctors data:', JSON.stringify(doctorsList, null, 2));
            if (doctorsList.length > 0) {
              const fullUrl = `${ApiService.getBaseUrl()}/${doctorsList[0].photo}`;
              console.log('First doctor photo data:', {
                photo: doctorsList[0].photo,
                full_url: fullUrl,
                base_url: ApiService.getBaseUrl()
              });
              console.log('TEST THIS URL IN BROWSER:', fullUrl);
            }
            setDoctors(doctorsList);
            setHasMore(doctorsList.length === limit);
            setPage(1);
            // Reset image errors when loading new doctors
            setImageErrors({});
            setImageLoaded({});
          }
        } catch (error) {
          console.error('Error loading doctors:', error);
        } finally {
          setLoading(false);
        }
      };
      
      loadFilteredDoctors();
    } else if (!specialtyId && specializations.length > 0 && !hasAutoSelected.current && lastSpecialtyId.current !== null) {
      // Handle case where user navigates back to "All" (no specialtyId)
      console.log('No specialtyId provided, resetting to show all doctors');
      hasAutoSelected.current = true;
      setSelectedFilter('All');
      
      const loadAllDoctors = async () => {
        try {
          setLoading(true);
          const limit = 10;
          const response = await ApiService.getDoctors(limit, 1, null);
          
          if (response.success && response.data.status) {
            let doctorsList = response.data.data || [];
            console.log('Received all doctors:', doctorsList.length);
            setDoctors(doctorsList);
            setHasMore(doctorsList.length === limit);
            setPage(1);
            setImageErrors({});
            setImageLoaded({});
          }
        } catch (error) {
          console.error('Error loading all doctors:', error);
        } finally {
          setLoading(false);
        }
      };
      
      loadAllDoctors();
    }
  }, [specialtyId, specializations]);

  const handleFilterChange = useCallback(async (specialization) => {
    setSelectedFilter(specialization.name);
    setPage(1);
    setDoctors([]);
    
    // Fetch doctors with the new filter
    try {
      setLoading(true);
      const limit = 10;
      const response = await ApiService.getDoctors(limit, 1, specialization.id);
      
      if (response.success && response.data.status) {
        let doctorsList = response.data.data || [];
        setDoctors(doctorsList);
        setHasMore(doctorsList.length === limit);
        setPage(1);
        setImageErrors({});
      }
    } catch (error) {
      // Handle error silently
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMoreDoctors = useCallback(async () => {
    if (loadingMore || !hasMore || loading) return;
    
    const nextPage = page + 1;
    setLoadingMore(true);
    
    try {
      const filterSpecialtyId = specializations.find(s => s.name === selectedFilter)?.id;
      const limit = 10;
      const response = await ApiService.getDoctors(limit, nextPage, filterSpecialtyId);
      
      if (response.success && response.data.status) {
        let doctorsList = response.data.data || [];
        setDoctors(prev => [...prev, ...doctorsList]);
        setHasMore(doctorsList.length === limit);
        setPage(nextPage);
      }
    } catch (error) {
      // Handle error silently
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore, loading, page, specializations, selectedFilter]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Common Header */}
      <CommonHeader title="Doctors" showSearch={true} showNotification={false} />

      {/* Search Bar - Fixed */}
      <View style={styles.searchContainer}>
          <View style={[styles.searchBar, isSearchFocused && styles.searchBarFocused]}>
            <MaterialIcons name="search" size={20} color="#666666" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search doctors by name or specialty..."
              placeholderTextColor="#999999"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              autoCorrect={false}
              autoCapitalize="none"
              returnKeyType="search"
              selectionColor="#005666"
              underlineColorAndroid="transparent"
            />
            {searchQuery.length > 0 && (
              <Pressable 
                onPress={() => setSearchQuery('')}
                style={styles.clearButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <MaterialIcons name="close" size={20} color="#666666" />
              </Pressable>
            )}
          </View>
        </View>

      {/* Filter Pills - Fixed */}
      <View style={styles.filtersContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersScrollContainer}>
            {specializations.map((specialization) => (
              <Pressable
                key={specialization.id || 'all'}
                style={[
                  styles.filterPill,
                  selectedFilter === specialization.name && styles.filterPillSelected
                ]}
                onPress={() => handleFilterChange(specialization)}
              >
                <Text style={[
                  styles.filterText,
                  selectedFilter === specialization.name && styles.filterTextSelected
                ]}>
                  {specialization.name}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

      {/* Doctors List - Scrollable */}
      <ScrollView 
        style={styles.doctorsContainer}
        onScroll={({ nativeEvent }) => {
          const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
          const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 50;
          if (isCloseToBottom) {
            loadMoreDoctors();
          }
        }}
        scrollEventThrottle={400}
        showsVerticalScrollIndicator={false}
      >
          {loading && page === 1 ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#005666" />
              <Text style={styles.loadingText}>Loading doctors...</Text>
            </View>
          ) : (
            <>
              {doctors.map((doctor) => {
                const derivedId = doctor.id || doctor.doctor_id;
                const rawPhoto = doctor.photo || doctor.image_url || doctor.image || doctor.profile_image;
                let constructedUrl = null;
                if (rawPhoto && rawPhoto.trim() !== "") {
                  const clean = rawPhoto.replace(/^\/+/, '');
                  constructedUrl = clean.startsWith('http') ? clean : `${ApiService.getBaseUrl()}/${clean}`;
                }
                console.log(`Doctor ${derivedId} photo check:`, {
                  rawPhoto,
                  imageError: imageErrors[derivedId],
                  constructedUrl,
                });
                
                return (
                <View key={derivedId} style={styles.doctorCard}>
                  <View style={styles.doctorInfo}>
                    <View style={styles.doctorAvatarContainer}>
                      {constructedUrl && !imageErrors[derivedId] ? (
                        <Image
                          source={{ uri: constructedUrl }}
                          style={styles.doctorAvatar}
                          onError={() => {
                            if (!imageErrors[derivedId]) {
                              setImageErrors(prev => ({ ...prev, [derivedId]: true }));
                            }
                          }}
                        />
                      ) : (
                        <MaterialIcons name="person" size={32} color="#666666" />
                      )}
                    </View>
                    <View style={styles.doctorDetails}>
                      <Text style={styles.doctorName}>{doctor.full_name || doctor.name}</Text>
                      <Text style={styles.doctorSpecialty}>{doctor.specialization_name || doctor.specialization || doctor.specialty}</Text>
                      {doctor.qualification && (
                        <Text style={styles.doctorQualification}>{doctor.qualification}</Text>
                      )}
                      {doctor.experience_years && (
                        <Text style={styles.doctorExperience}>
                          {doctor.experience_years} years experience
                        </Text>
                      )}
                    </View>
                  </View>
                  <View style={styles.doctorActions}>
                    <Pressable 
                      style={styles.bookButton}
                      onPress={() => {

                        const doctorId = doctor.id || doctor.doctor_id || (index + 1);
                                                
                                                if (doctorId) {
                                                  const navUrl = `/main/bookAppointment?doctorId=${doctorId}`;
                                                  router.push(navUrl);
                                                } else {
                                                  router.push('/main/bookAppointment');
                                                }


                        
                        
                      }}
                    >
                      <Text style={styles.bookButtonText}>Appointment</Text>
                    </Pressable>
                  </View>
                </View>
                );
              })}
              
              {loadingMore && (
                <View style={styles.loadingMoreContainer}>
                  <ActivityIndicator size="small" color="#005666" />
                  <Text style={styles.loadingMoreText}>Loading more...</Text>
                </View>
              )}
              
              {!hasMore && doctors.length > 0 && (
                <Text style={styles.endText}>No more doctors to load</Text>
              )}
            </>
          )}
        </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  searchContainer: {
    paddingTop: 16,
    paddingBottom: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  searchBarFocused: {
    borderColor: '#005666',
    borderWidth: 2,
    elevation: 3,
    shadowOpacity: 0.15,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1a1a1a',
    paddingVertical: 0,
    minHeight: 24,
    outline: 'none',
    borderWidth: 0,
    borderColor: 'transparent',
    backgroundColor: 'transparent',
    textDecorationLine: 'none',
    outlineWidth: 0,
    outlineColor: 'transparent',
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },
  filtersContainer: {
    paddingVertical: 0,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  filtersScrollContainer: {
    paddingHorizontal: 0,
    gap: 12,
  },
  filterPill: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  filterPillSelected: {
    backgroundColor: '#005666',
    borderColor: '#005666',
  },
  filterText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  filterTextSelected: {
    color: '#FFFFFF',
  },
  doctorsContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 20,
  },
  doctorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  doctorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  doctorAvatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    overflow: 'hidden',
  },
  doctorAvatar: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
    resizeMode: 'cover',
  },
  doctorDetails: {
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  doctorSpecialty: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 1,
  },
  doctorQualification: {
    fontSize: 13,
    color: '#005666',
    fontWeight: '500',
    marginBottom: 1,
  },
  doctorExperience: {
    fontSize: 12,
    color: '#888888',
    fontStyle: 'italic',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666666',
  },
  loadingMoreContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  loadingMoreText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#666666',
  },
  endText: {
    textAlign: 'center',
    paddingVertical: 20,
    fontSize: 14,
    color: '#999999',
  },
  reviewsText: {
    fontSize: 12,
    color: '#666666',
    marginLeft: 4,
  },
  doctorFees: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#005666',
    marginTop: 4,
  },
  ratingText: {
    fontSize: 12,
    color: '#666666',
  },
  doctorActions: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    minWidth: 80,
  },
  bookButton: {
    backgroundColor: '#005666',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  bookButtonText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});