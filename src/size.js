import {useState} from 'react';
import {Dimensions} from 'react-native';

export function Size() {
  const [size, setSize] = useState(Dimensions.get('screen'));

  Dimensions.addEventListener('change', function () {
    const width = Dimensions.get('screen').width;
    const height = Dimensions.get('screen').height;
    setSize({width: width, height: height});
  });

  return size;
}
