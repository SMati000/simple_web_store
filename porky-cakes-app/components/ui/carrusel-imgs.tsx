import React, { useRef, useState } from 'react';
import { View, FlatList, Image, Dimensions, StyleSheet, NativeScrollEvent, NativeSyntheticEvent, Text } from 'react-native';
import { images } from '@/constants/images';
import logger from '@/utils/logger';
import { Colors, useThemeColors } from '@/constants/theme'

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width * 0.80;

export interface ImagenData {
  id: number;
  uri: string;
}

interface ImageCarouselProps {
  imagenes: ImagenData[];
}

export default function ImageCarousel({ imagenes }: ImageCarouselProps) {
  const colors = useThemeColors();
  const styles = createStyles(colors);
  
  const [index, setIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(offsetX / ITEM_WIDTH);
    setIndex(newIndex);
  };

  logger.debug("imagenes: ", imagenes)

  return (
    <>
    <Text style={styles.title}>Otras sugerencias:</Text>
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={imagenes}
        horizontal
        pagingEnabled={false}
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        snapToInterval={ITEM_WIDTH}
        decelerationRate="fast"
        snapToAlignment="start"
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.imageContainer}>
            <Image 
              source={images[item.uri as keyof typeof images]} 
              style={styles.image}
            />
          </View>
        )}
      />

      <View style={styles.dotsContainer}>
        {imagenes.map((_, i) => (
          <View
            key={i}
            style={[styles.dot, i === index && styles.activeDot]}
          />
        ))}
      </View>
    </View>
    </>
  );
}

const createStyles = (colors: typeof Colors.light) => StyleSheet.create({
  title: {
    width: ITEM_WIDTH,
    alignSelf: 'center',
    fontWeight: 'bold',
    color: colors.text,
    fontSize: 18,
    marginBottom: 8,
  },
  container: {
    height: "25%",
    maxHeight: 200,
    width: ITEM_WIDTH,
    borderWidth: 1,
    borderColor: colors.background2,
    marginBottom: 10,
    alignSelf: 'center'
  },
  imageContainer: {
    width: ITEM_WIDTH,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  dotsContainer: {
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
    flexDirection: 'row',
  },
  dot: {
    width: 8,
    height: 8,
    borderColor: colors.background3,
    borderWidth: 0.5,
    borderRadius: 4,
    backgroundColor: colors.tabIconDefault,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: colors.tabIconSelected,
  },
});
