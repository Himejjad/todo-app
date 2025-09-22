import React, { useEffect, useState, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, View, Text, TextInput, Pressable, FlatList, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform, Appearance } from 'react-native';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL, OFFLINE_MODE } from './src/config';
import { Todo } from './src/types';
import { TodoItem } from './src/components/TodoItem';
import { computeStats } from './src/utils';
import { getTheme, systemColorScheme, ThemeMode } from './src/theme';

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [themeMode, setThemeMode] = useState<ThemeMode>(systemColorScheme());
  const theme = getTheme(themeMode);

  // Persist + load theme
  useEffect(() => {
    AsyncStorage.getItem('themeMode').then((stored: string | null) => {
      if (stored === 'light' || stored === 'dark') setThemeMode(stored);
    });
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      AsyncStorage.getItem('themeFollowSystem').then((follow: string | null) => {
        if (follow === 'true' && (colorScheme === 'light' || colorScheme === 'dark')) {
          setThemeMode(colorScheme);
        }
      });
    });
    return () => subscription.remove();
  }, []);

  const fetchTodos = async () => {
    try {
      setError('');
      if (OFFLINE_MODE) {
        const cached = await AsyncStorage.getItem('todos-cache');
        if (cached) setTodos(JSON.parse(cached));
        return;
      }
      const response = await axios.get<Todo[]>(`${API_BASE_URL}/todos`);
      setTodos(response.data);
      await AsyncStorage.setItem('todos-cache', JSON.stringify(response.data));
    } catch (err) {
      console.error(err);
      setError('Failed to load todos. Pull to retry.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    // Load cache first for instant UI
    (async () => {
      try {
        const cached = await AsyncStorage.getItem('todos-cache');
        if (cached) {
          setTodos(JSON.parse(cached));
          setLoading(false);
        }
      } catch {}
      fetchTodos();
    })();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchTodos();
  }, []);

  const addTodo = async () => {
    if (!newTodo.trim()) return;
    try {
      setError('');
      const optimistic: Todo = { _id: `optimistic-${Date.now()}`, text: newTodo.trim(), completed: false };
      setTodos(prev => [...prev, optimistic]);
      setNewTodo('');
      if (!OFFLINE_MODE) {
        const response = await axios.post<Todo>(`${API_BASE_URL}/todos`, { text: optimistic.text });
        setTodos(prev => prev.map(t => (t._id === optimistic._id ? response.data : t)));
      }
      await AsyncStorage.setItem('todos-cache', JSON.stringify([...todos, optimistic]));
      setNewTodo('');
    } catch (err) {
      console.error(err);
      setError('Failed to add todo.');
      // rollback optimistic
      setTodos(prev => prev.filter(t => !t._id.startsWith('optimistic-')));
    }
  };

  const toggleTodo = async (id: string, completed: boolean) => {
    try {
      setError('');
      // optimistic flip
      setTodos(prev => prev.map(t => (t._id === id ? { ...t, completed: !t.completed } : t)));
      if (!OFFLINE_MODE) {
        const response = await axios.put<Todo>(`${API_BASE_URL}/todos/${id}`);
        setTodos(prev => prev.map(t => (t._id === id ? response.data : t)));
      }
      await AsyncStorage.setItem('todos-cache', JSON.stringify(todos));
    } catch (err) {
      console.error(err);
      setError('Failed to update todo.');
      // refetch to ensure consistency
      if (!OFFLINE_MODE) fetchTodos();
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      setError('');
      setTodos(prev => prev.filter(t => t._id !== id));
      if (!OFFLINE_MODE) {
        await axios.delete(`${API_BASE_URL}/todos/${id}`);
      }
      await AsyncStorage.setItem('todos-cache', JSON.stringify(todos.filter(t => t._id !== id)));
    } catch (err) {
      console.error(err);
      setError('Failed to delete todo.');
      if (!OFFLINE_MODE) fetchTodos();
    }
  };

  const { total: totalCount, completed: completedCount, pending: pendingCount } = computeStats(todos);

  const toggleTheme = async () => {
    const next: ThemeMode = themeMode === 'light' ? 'dark' : 'light';
    setThemeMode(next);
    await AsyncStorage.setItem('themeMode', next);
  };

  return (
    <LinearGradient colors={theme.gradient} style={styles.gradient}>
      <StatusBar style={themeMode === 'dark' ? 'light' : 'light'} />
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
          <View style={styles.container}>
            <View style={styles.header}> 
              <Text style={[styles.title, { color: theme.textInverse }]}>✨ Todo App</Text>
              <Text style={[styles.subtitle, { color: theme.subtle }]}>Stay organized and productive</Text>
              <Pressable onPress={toggleTheme} style={styles.themeToggle} accessibilityLabel="Toggle theme">
                <Text style={{ color: theme.textInverse }}>{themeMode === 'light' ? '🌙' : '☀️'}</Text>
              </Pressable>
            </View>

            {error && !OFFLINE_MODE ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <View style={styles.inputRow}>
              <TextInput
                placeholder="What needs to be done?"
                placeholderTextColor="#6b7280"
                value={newTodo}
                onChangeText={setNewTodo}
                style={[styles.input, { backgroundColor: theme.card, color: theme.textPrimary, borderColor: theme.border }]}
                maxLength={200}
                returnKeyType="done"
                onSubmitEditing={addTodo}
              />
              <Pressable style={[styles.addButton, !newTodo.trim() && styles.addButtonDisabled]} disabled={!newTodo.trim()} onPress={addTodo}>
                <Text style={styles.addButtonText}>+ Add</Text>
              </Pressable>
            </View>

            {totalCount > 0 && (
              <View style={[styles.statsRow, { backgroundColor: themeMode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.3)' }] }>
                <View style={styles.statItem}>
                  <Text style={[styles.statNumber]}>{totalCount}</Text>
                  <Text style={[styles.statLabel]}>Total</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={[styles.statNumber]}>{pendingCount}</Text>
                  <Text style={[styles.statLabel]}>Pending</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={[styles.statNumber]}>{completedCount}</Text>
                  <Text style={[styles.statLabel]}>Completed</Text>
                </View>
              </View>
            )}

            {loading ? (
              <View style={styles.loadingBox}>
                <ActivityIndicator color={themeMode === 'dark' ? '#a5b4fc' : '#667eea'} />
                <Text style={[styles.loadingText, { color: theme.textInverse }]}>Loading your tasks...</Text>
              </View>
            ) : todos.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>📝</Text>
                <Text style={[styles.emptyText, { color: theme.textInverse }]}>No tasks yet</Text>
                <Text style={[styles.emptySubText, { color: theme.subtle }]}>Add a task above to get started</Text>
              </View>
            ) : (
              <FlatList
                data={todos}
                keyExtractor={(item) => item._id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                refreshing={refreshing && !OFFLINE_MODE}
                onRefresh={!OFFLINE_MODE ? onRefresh : undefined}
                ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
                renderItem={({ item }) => (
                  <TodoItem item={item} onToggle={toggleTodo} onDelete={deleteTodo} />
                )}
                style={styles.list}
              />
            )}
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safeArea: { flex: 1 },
  flex: { flex: 1 },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 28,
  },
  themeToggle: {
    position: 'absolute',
    right: 0,
    top: 0,
    padding: 8,
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    color: 'white',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 16,
    marginTop: 4,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 16,
    paddingHorizontal: 18,
    fontSize: 16,
    height: 54,
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  addButton: {
    backgroundColor: '#667eea',
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    shadowColor: '#667eea',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 3,
  },
  addButtonDisabled: {
    opacity: 0.5,
  },
  addButtonText: { color: 'white', fontWeight: '600', fontSize: 16 },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
  },
  statItem: { alignItems: 'center' },
  statNumber: { fontSize: 18, fontWeight: '700', color: 'white' },
  statLabel: { color: 'white', opacity: 0.85, fontSize: 12, marginTop: 2 },
  loadingBox: { alignItems: 'center', padding: 32 },
  loadingText: { marginTop: 12, color: 'white', fontSize: 16 },
  emptyState: { alignItems: 'center', padding: 44 },
  emptyIcon: { fontSize: 56, marginBottom: 12 },
  emptyText: { fontSize: 20, fontWeight: '600', color: 'white' },
  emptySubText: { color: 'white', opacity: 0.85, marginTop: 4 },
  list: { flex: 1 },
  listContent: { paddingBottom: 40 },
  errorBox: {
    backgroundColor: '#fee2e2',
    padding: 14,
    borderRadius: 16,
    marginBottom: 20,
  },
  errorText: { color: '#dc2626', textAlign: 'center', fontWeight: '500' },
});
