import {useState, useEffect} from 'react';
import {Dimensions} from 'react-native';

export function Size() {
  const [size, setSize] = useState(Dimensions.get('screen'));
  useEffect(() => {
    Dimensions.addEventListener('change', function () {
      const width = Dimensions.get('screen').width;
      const height = Dimensions.get('screen').height;
      setSize({width: width, height: height});
    });
  }, []);

  return size;
}

export function SizeScale() {
  const width = Dimensions.get('screen').width;
  const height = Dimensions.get('screen').height;
  const [size, setSize] = useState(
    width > height
      ? {width: width / 1366, height: height / 1014}
      : {width: width / 1014, height: height / 1366},
  );

  useEffect(() => {
    Dimensions.addEventListener('change', function () {
      if (width > height) {
        setSize({width: width / 1366, height: height / 1014});
      } else {
        setSize({width: width / 1014, height: height / 1366});
      }
    });
  }, []);

  return size;
}
