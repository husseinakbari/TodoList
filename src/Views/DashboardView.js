import React, {useMemo, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Keyboard,
  Linking
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import Toast from 'react-native-toast-message'
import {
  HeaderScreen,
  SafeView,
  CreateButton,
  TaskItem,
  SearchBar,
  FilterAndSort,
  FilterModal,
  DeleteModal,
} from '../components';
import {colors, FaIcon, fonts, metrics} from '../themes';
import {screenName} from '../utils/constans';
import {SwipeListView} from 'react-native-swipe-list-view';
import {deleteTaskAction} from '../redux/task/taskActions';
import {priorityOptions, sortOptions} from '../models';

const DashboardPage = ({navigation}) => {
  const dispatch = useDispatch();
  const list = useSelector(state => state.taskList.list);

  const [searchText, setSearchText] = useState('');
  const [sortIndex, setSortType] = useState(0);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState({
    show: false,
    id: null
  })
  const [filters, setFilters] = useState({
    status: false,
    priorites: [],
  });

  const onDeleteTask = (id) => {
    setShowDeleteAlert({
      show: true,
      id
    })
    
  };
  
  const handleDeleteTask = () => {
    dispatch(deleteTaskAction({id: showDeleteAlert.id}));
    setShowDeleteAlert({
      show: false,
      id: null
    })
    Toast.show({
      type: 'success',
      text1: 'Task deleted successfully'
    })
  }

  const handleSortPress = () => {
    let index = 0;
    if (sortIndex < sortOptions.length - 1) {
      index = sortIndex + 1;
    }
    setSortType(index);
  };

  const compareSort = (a, b) => {
    switch (sortOptions[sortIndex].key) {
      case 'alphabet':
        let nameA = a.name.toUpperCase();
        let nameB = b.name.toUpperCase();
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      case 'priority':
        let priorityA = priorityOptions.findIndex(item => item === a.priority);
        let priorityB = priorityOptions.findIndex(item => item === b.priority);

        if (priorityA > priorityB) {
          return -1;
        }

        if (priorityA < priorityB) {
          return 1;
        }

        return 0;

      default:
        return b.id - a.id;
    }
  };

  const handleFilters = (input, value) => {
    if (input === 'status') {
      setFilters(prevState => ({
        ...filters,
        status: !prevState.status,
      }));
    } else {
      let _priority = [...filters.priorites];
      if (_priority.includes(value)) {
        _priority = _priority.filter(el => el !== value);
      } else {
        _priority.push(value);
      }
      setFilters({
        ...filters,
        priorites: _priority,
      });
    }
  };

  const openUrlLink = async () => {
    const url = "https://github.com/MarioRover"
    Linking.canOpenURL(url).then(() => {
      Linking.openURL(url);
    });
  }

  const calcualtedTaskList = useMemo(() => {
    let data = Object.values(list);
    data.sort((a, b) => compareSort(a, b));
    if (filters.status) {
      data = data.filter(el => el.status);
    }
    if (filters.priorites.length) {
      let _data = [];

      filters.priorites.forEach(prio => {
        _data = _data.concat(data.filter(task => task.priority === prio));
      });

      data = _data;
    }

    data = data.filter(
      item => item.name.toLowerCase().indexOf(searchText.toLowerCase()) > -1,
    );
    return data;
  }, [list, sortIndex, searchText, filters]);

  return (
    <SafeView>
      <HeaderScreen title="All Tasks" />
      <Pressable onPress={() => Keyboard.dismiss()} style={styles.screen}>
        <Pressable style={styles.header} onPress={openUrlLink}>
          <Text style={styles.title}>Created By Hossein Akbari, </Text>
          <View style={styles.row}>
            <Text style={styles.title}>Follow Me</Text>
            <FaIcon name="github" color={colors.grayDark} style={styles.icon} />
          </View>
        </Pressable>
        <SearchBar value={searchText} onChangeText={setSearchText} />
        <FilterAndSort
          sort={sortOptions[sortIndex].title}
          onSortPress={handleSortPress}
          onFilterPress={() => setShowFilterModal(true)}
        />
        <SwipeListView
          data={calcualtedTaskList}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({item}) => renderItem(item, navigation)}
          renderHiddenItem={({item}) => renderHiddenItem(item, onDeleteTask)}
          ListFooterComponent={renderFooter}
          leftOpenValue={80}
          previewRowKey={'0'}
          previewOpenDelay={3000}
        />
        <FilterModal
          visible={showFilterModal}
          onClose={() => setShowFilterModal(false)}
          filters={filters}
          handleFilters={handleFilters}
        />

        <DeleteModal
          visible={showDeleteAlert.show}
          onClose={() => setShowDeleteAlert(false)}
          onDelete={handleDeleteTask}
        />

        <View style={styles.createBtnWrapper}>
          <CreateButton
            onPress={() => navigation.navigate(screenName.create)}
          />
        </View>
      </Pressable>
    </SafeView>
  );
};

const renderItem = (item, navigation) => {
  return (
    <Pressable
      onPress={() =>
        navigation.navigate(screenName.details, {
          id: item.id,
        })
      }>
      <TaskItem item={item} />
    </Pressable>
  );
};

const renderHiddenItem = (item, onDeleteTask) => {
  return (
    <View style={styles.rowBack}>
      <TouchableOpacity
        style={styles.backRightBtn}
        onPress={() => {
          onDeleteTask(item.id);
        }}>
        <Text style={styles.backTextWhite}>
          <FaIcon name="trash" color={colors.white} />
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const renderFooter = () => {
  return (
    <View style={styles.emptyView} />
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.gray,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 16,
    paddingHorizontal: 16,
  },
  createBtnWrapper: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    width: metrics.screenWidth,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowBack: {
    flex: 1,
  },
  backRightBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 75,
    height: 60,
    backgroundColor: colors.red,
    borderRadius: 15,
  },
  backTextWhite: {
    color: colors.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontFamily: fonts.bold,
    color: colors.grayDark,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  icon: {
    marginLeft: 5
  },
  emptyView: {
    width: '100%',
    height: 100
  }
});

export default DashboardPage;
