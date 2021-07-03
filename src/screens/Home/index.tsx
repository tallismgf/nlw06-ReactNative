import React, { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { FlatList, View, Text } from 'react-native';
import { Appointment, AppointmentProps } from '../../components/Appointment';
import { Background } from '../../components/Background';
import { ButtonAdd } from '../../components/ButtonAdd';
import { CategorySelect } from '../../components/CategorySelect';
import { ListDivider } from '../../components/ListDivider';
import { ListHeader } from '../../components/ListHeader';
import Load from '../../components/Load';

import { Profile } from '../../components/Profile';
import { COLLECTION_APPOINTMENTS } from '../../configs/database';
import { styles } from './styles';

export function Home(){
  const [category, setCategory] = useState('');
  const navigation = useNavigation();
  const [appoinments, setAppointments] = useState<AppointmentProps[]>([]);
  const [loading, setLoading] = useState(true);

  function handleCategorySelect(categoryId: string){
    categoryId === category ? setCategory('') : setCategory(categoryId);
  }

  function handleAppointmentDetails(guildSelected: AppointmentProps){
    navigation.navigate('AppointmentDetails', {guildSelected})
  }

  function handleAppointmentCreate(){
    navigation.navigate('AppointmentCreate')
  }

  async function loadAppointments(){

    const response = await AsyncStorage.getItem(COLLECTION_APPOINTMENTS);
    const storage: AppointmentProps[] = response ? JSON.parse(response) : [];

    if(category){
      setAppointments(storage.filter(item => item.category === category));
    } else {
      setAppointments(storage);
    }

    setLoading(false);
  }

  useFocusEffect(useCallback(() => {
    loadAppointments();
  }, [category]));

  return(
    <Background>
      <View style={styles.header}>

        <Profile />
        <ButtonAdd 
          onPress={handleAppointmentCreate}
        />

      </View>
      <CategorySelect   
        categorySelected={category}
        setCategory={handleCategorySelect}
      />

      { loading ? <Load /> :
        <>
          <ListHeader 
            title="Partidas Agendadas"
            subtitle={`Total ${appoinments.length}`}
          />

          <FlatList 
            data={appoinments}
            keyExtractor={item => item.id}
            renderItem={({item}) => (
              <Appointment  data={item} onPress={() => handleAppointmentDetails(item)} />
            )}
            contentContainerStyle={{ paddingBottom: 69 }}
            style={styles.matches}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <ListDivider />}
          /> 
        </>
      }
    </Background>
  );
}