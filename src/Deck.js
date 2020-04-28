import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Animated,
  PanResponder,
  Dimensions,
  LayoutAnimation,
  UIManager
 } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;
const SWIPE_OUT_DURATION = 250;

const Deck = ({data, renderCard, onSwipeLeft, onSwipeRight, renderNoMoreCards}) => {
  const position = new Animated.ValueXY()

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (event, gesture) => {
      position.setValue({x: gesture.dx, y: gesture.dy})
    },
    onPanResponderRelease: (event, gesture) => {
      if (gesture.dx > SWIPE_THRESHOLD) {
        return forceSwipe('right')
      } else if (gesture.dx < -SWIPE_THRESHOLD) {
        return forceSwipe('left')
      }
      return resetPosition()
    }
  })
  const [index, setIndex] = useState(0)
  const isFirstRender = useRef(true);

  useEffect(() => {
    if(data) {
      setIndex(0)
    }
  }, [data])

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true)
    LayoutAnimation.spring()
  });

  const getCardStyle = () => {
    const rotate = position.x.interpolate({
      inputRange: [-SCREEN_WIDTH * 2, 0 , SCREEN_WIDTH * 2],
      outputRange: ['-120deg', '0deg', '120deg']
    })
    return {
      ...position.getLayout(),
      transform: [{rotate}]
    }
  }

  const forceSwipe = (direction) => {
    const x = direction === 'right' ? SCREEN_WIDTH : -SCREEN_WIDTH
    Animated.timing(position, {
      toValue: {x , y: 0},
      duration: SWIPE_OUT_DURATION
    }).start(() => onSwipeComplete(direction))
  }

  function onSwipeComplete(direction) {
    const item = data[index]
    setIndex(index + 1)
    position.setValue({x:0, y:0})
    direction === 'right' ? onSwipeRight(item) : onSwipeLeft(item)
  }

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: {x: 0, y: 0}
    }).start()
  }
  const renderCards = () => {
    if (index >= data.length) return renderNoMoreCards()
    return data.map((item, i) => {
      if (i < index) return null
      if (i === index) {
        return (
          <Animated.View
            key={item.id}
            style={[getCardStyle(), styles.cardStyle, { zIndex: 99 }]}
            {...panResponder.panHandlers}>
            {renderCard(item)}
          </Animated.View>

        )
      }
      return (
        <Animated.View
          key={item.id}
          style={[styles.cardStyle, {top: 10 * (i - index), zIndex: 5}]}
          >
          {renderCard(item)}
        </Animated.View>
      )
    }).reverse()
  }
 return (
    <View>
      {renderCards()}
    </View>
  )
}

const styles = {
  cardStyle: {
    position: 'absolute',
    width: SCREEN_WIDTH
  }
}

export default Deck;
