import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { NavigationProp } from '@react-navigation/native';
import { Bar } from '../../../shared/types/bar';

interface HomeScreenProps {
  navigation: NavigationProp<any>;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [bars, setBars] = useState<Bar[]>([]);
  const [selectedBar, setSelectedBar] = useState<Bar | null>(null);

  useEffect(() => {
    const fetchBars = async () => {
      try {
        fetch("http://localhost:8080/api/bar", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          })
            .then((response) => response.json())
            .then((data) => {
              setBars(data.bars);
            })
            .catch((error) => {
              throw Error(error.message);
            });
      
      } catch (error) {
        console.error('Error fetching bars:', error);
      }
    };

    fetchBars();
  }, []);

  const handleBarChange = (barId: number) => {
    const bar = bars.find((b) => b.id === barId) || null;
    setSelectedBar(bar);
  };

  return (
    <View>
      <Text>Home Screen</Text>
      <Picker
        selectedValue={selectedBar?.id}
        onValueChange={(itemValue) => handleBarChange(itemValue as number)}
      >
        {bars.map((bar) => (
          <Picker.Item key={bar.id} label={bar.name} value={bar.id} />
        ))}
      </Picker>
      {selectedBar && (
        <View>
          <Text>{selectedBar.name}</Text>
          {selectedBar.pintPrices.map((pintPrice) => (
            <Text key={pintPrice.id}>
              {pintPrice.name}: {pintPrice.price}
            </Text>
          ))}
        </View>
      )}
      <Button
        title="Go to Details"
      />
    </View>
  );
};

export default HomeScreen;