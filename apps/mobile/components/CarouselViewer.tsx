import React, { useRef, useState } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  FlatList,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { Colors, Spacing, Radius, FontSize } from '../constants/theme';
import { getSlideImageUrl } from '../services/api';
import type { ISlide } from '../services/api';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SLIDE_SIZE = SCREEN_WIDTH - Spacing.md * 2;

interface CarouselViewerProps {
  postId: string;
  slides: ISlide[];
  onSlideChange?: (index: number) => void;
}

export function CarouselViewer({ postId, slides, onSlideChange }: CarouselViewerProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / SLIDE_SIZE);
    if (index !== activeIndex) {
      setActiveIndex(index);
      onSlideChange?.(index);
    }
  };

  const goTo = (index: number) => {
    flatListRef.current?.scrollToIndex({ index, animated: true });
    setActiveIndex(index);
    onSlideChange?.(index);
  };

  if (!slides || slides.length === 0) {
    return (
      <View style={styles.empty}>
        <ActivityIndicator color={Colors.brandPurple} />
        <Text style={styles.emptyText}>Loading slides…</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Slide Images */}
      <FlatList
        ref={flatListRef}
        data={slides}
        keyExtractor={(item) => item._id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToInterval={SLIDE_SIZE}
        decelerationRate="fast"
        onScroll={handleScroll}
        scrollEventThrottle={16}
        renderItem={({ item }) => (
          <SlideItem postId={postId} slide={item} size={SLIDE_SIZE} />
        )}
        getItemLayout={(_, index) => ({
          length: SLIDE_SIZE,
          offset: SLIDE_SIZE * index,
          index,
        })}
      />

      {/* Navigation arrows */}
      {activeIndex > 0 && (
        <TouchableOpacity
          style={[styles.arrow, styles.arrowLeft]}
          onPress={() => goTo(activeIndex - 1)}
        >
          <Text style={styles.arrowText}>‹</Text>
        </TouchableOpacity>
      )}
      {activeIndex < slides.length - 1 && (
        <TouchableOpacity
          style={[styles.arrow, styles.arrowRight]}
          onPress={() => goTo(activeIndex + 1)}
        >
          <Text style={styles.arrowText}>›</Text>
        </TouchableOpacity>
      )}

      {/* Dot pagination */}
      <View style={styles.dots}>
        {slides.map((_, i) => (
          <TouchableOpacity key={i} onPress={() => goTo(i)}>
            <View
              style={[
                styles.dot,
                i === activeIndex && styles.dotActive,
              ]}
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* Slide counter */}
      <View style={styles.counter}>
        <Text style={styles.counterText}>
          {activeIndex + 1} / {slides.length}
        </Text>
      </View>
    </View>
  );
}

function SlideItem({
  postId,
  slide,
  size,
}: {
  postId: string;
  slide: ISlide;
  size: number;
}) {
  const [loading, setLoading] = useState(true);
  const [errored, setErrored] = useState(false);
  const uri = getSlideImageUrl(postId, slide.slideNumber);

  return (
    <View style={[styles.slideWrapper, { width: size }]}>
      {loading && !errored && (
        <ActivityIndicator
          style={StyleSheet.absoluteFill}
          color={Colors.brandPurple}
        />
      )}
      {errored ? (
        <View style={styles.errorSlide}>
          <Text style={styles.errorText}>⚠ Image unavailable</Text>
          <Text style={styles.errorSub}>{uri}</Text>
        </View>
      ) : (
        <Image
          source={{ uri }}
          style={styles.slideImage}
          resizeMode="contain"
          onLoad={() => setLoading(false)}
          onError={() => {
            setLoading(false);
            setErrored(true);
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  slideWrapper: {
    aspectRatio: 0.8, // 4:5 portrait (Instagram carousel)
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 0,
  },
  slideImage: {
    width: '100%',
    height: '100%',
  },
  empty: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  emptyText: {
    color: Colors.textMuted,
    fontSize: FontSize.sm,
  },
  arrow: {
    position: 'absolute',
    top: '40%',
    backgroundColor: Colors.overlay,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowLeft: { left: Spacing.sm },
  arrowRight: { right: Spacing.sm },
  arrowText: {
    color: Colors.textPrimary,
    fontSize: 28,
    lineHeight: 32,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: Spacing.md,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.textMuted,
  },
  dotActive: {
    backgroundColor: Colors.brandPurple,
    width: 18,
  },
  counter: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    backgroundColor: Colors.overlay,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radius.pill,
  },
  counterText: {
    color: Colors.textPrimary,
    fontSize: FontSize.xs,
  },
  errorSlide: {
    padding: Spacing.md,
    alignItems: 'center',
    gap: Spacing.xs,
  },
  errorText: {
    color: Colors.error,
    fontSize: FontSize.md,
    fontWeight: '600',
  },
  errorSub: {
    color: Colors.textMuted,
    fontSize: FontSize.xs,
    textAlign: 'center',
  },
});
