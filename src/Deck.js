import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  Animated,
  PanResponder,
  Dimensions
 } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;
const SWIPE_OUT_DURATION = 250;

const Deck = ({data, renderCard, onSwipeLeft, onSwipeRight}) => {
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
    return data.map((item, i) => {
      if(i < index) return null
      if(i === index) {
        return (
          <Animated.View
            key={item.id}
            style={getCardStyle()}
            {...panResponder.panHandlers}>
            {renderCard(item)}
          </Animated.View>

        )
      }
      return renderCard(item)
    })
  }
 return (
    <View>
      {renderCards()}
    </View>
  )
}

export default Deck;
