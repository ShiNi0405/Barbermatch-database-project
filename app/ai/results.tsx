import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  FlatList,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { 
  ArrowLeft, 
  ChevronDown, 
  Save, 
  Share2, 
  Calendar,
  Palette
} from 'lucide-react-native';
import * as Sharing from 'expo-sharing';

const HAIRSTYLES = [
  { id: '1', name: 'Crew Cut', image: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg' },
  { id: '2', name: 'Undercut', image: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg' },
  { id: '3', name: 'Buzz Cut', image: 'https://images.pexels.com/photos/1040882/pexels-photo-1040882.jpeg' },
  { id: '4', name: 'Fade', image: 'https://images.pexels.com/photos/1040883/pexels-photo-1040883.jpeg' },
];

const CATEGORIES = ['Haircuts', 'Shaves', 'Styling'];
const COLORS = ['Natural', 'Blonde', 'Brown', 'Black', 'Red'];

export default function AIResultsScreen() {
  const router = useRouter();
  const [selectedGender, setSelectedGender] = useState('Men');
  const [selectedColor, setSelectedColor] = useState('Natural');
  const [selectedCategory, setSelectedCategory] = useState('Haircuts');
  const [selectedHairstyle, setSelectedHairstyle] = useState(HAIRSTYLES[0]);

  const handleSaveImage = async () => {
    Alert.alert('Success', 'Image saved to your gallery!');
  };

  const handleShare = async () => {
    try {
      await Sharing.shareAsync(selectedHairstyle.image, {
        mimeType: 'image/jpeg',
        dialogTitle: 'Share your new look!',
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share image');
    }
  };

  const handleBookWithLook = () => {
    router.push('/(customer)/(tabs)/discover');
  };

  const renderHairstyle = ({ item }: { item: typeof HAIRSTYLES[0] }) => (
    <TouchableOpacity
      style={[
        styles.hairstyleOption,
        selectedHairstyle.id === item.id && styles.hairstyleOptionSelected
      ]}
      onPress={() => setSelectedHairstyle(item)}
    >
      <Image source={{ uri: item.image }} style={styles.hairstyleImage} />
      <Text style={styles.hairstyleName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#1F2937" />
        </TouchableOpacity>

        <View style={styles.headerControls}>
          <TouchableOpacity style={styles.dropdown}>
            <Text style={styles.dropdownText}>{selectedGender}</Text>
            <ChevronDown size={16} color="#6B7280" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.dropdown}>
            <Palette size={16} color="#6B7280" />
            <Text style={styles.dropdownText}>{selectedColor}</Text>
            <ChevronDown size={16} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.previewContainer}>
        <Image
          source={{ uri: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg' }}
          style={styles.previewImage}
        />
        <View style={styles.overlay}>
          <Text style={styles.overlayText}>Your photo with {selectedHairstyle.name}</Text>
        </View>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={handleSaveImage}>
          <Save size={20} color="#3B82F6" />
          <Text style={styles.actionButtonText}>Save Image</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
          <Share2 size={20} color="#3B82F6" />
          <Text style={styles.actionButtonText}>Share to Social</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.primaryActionButton} onPress={handleBookWithLook}>
          <Calendar size={20} color="#FFFFFF" />
          <Text style={styles.primaryActionButtonText}>Book with this look</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.categoriesContainer}>
        <FlatList
          data={CATEGORIES}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryChip,
                selectedCategory === item && styles.categoryChipSelected
              ]}
              onPress={() => setSelectedCategory(item)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === item && styles.categoryTextSelected
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categories}
        />
      </View>

      <FlatList
        data={HAIRSTYLES}
        renderItem={renderHairstyle}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.hairstyles}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 8,
  },
  headerControls: {
    flexDirection: 'row',
    gap: 8,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  dropdownText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
  },
  previewContainer: {
    height: 300,
    marginHorizontal: 20,
    marginVertical: 16,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  overlayText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  actionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#3B82F6',
    borderRadius: 8,
    paddingVertical: 12,
    gap: 4,
  },
  actionButtonText: {
    color: '#3B82F6',
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  primaryActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    paddingVertical: 12,
    gap: 4,
  },
  primaryActionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  categoriesContainer: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
  },
  categories: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  categoryChip: {
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
  },
  categoryChipSelected: {
    backgroundColor: '#3B82F6',
  },
  categoryText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  categoryTextSelected: {
    color: '#FFFFFF',
    fontFamily: 'Inter-SemiBold',
  },
  hairstyles: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  hairstyleOption: {
    width: 100,
    marginRight: 12,
    alignItems: 'center',
  },
  hairstyleOptionSelected: {
    opacity: 1,
  },
  hairstyleImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginBottom: 8,
  },
  hairstyleName: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
    textAlign: 'center',
  },
});