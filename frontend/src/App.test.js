import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import App from './App';

// Mock axios
jest.mock('axios');
const mockedAxios = axios;

test('renders todo app title', () => {
  render(<App />);
  const titleElement = screen.getByText(/To-Do List/i);
  expect(titleElement).toBeInTheDocument();
});

test('renders add todo input and button', () => {
  render(<App />);
  const inputElement = screen.getByPlaceholderText(/Add a new task/i);
  const buttonElement = screen.getByText(/Add/i);
  expect(inputElement).toBeInTheDocument();
  expect(buttonElement).toBeInTheDocument();
});

test('can type in todo input', () => {
  render(<App />);
  const inputElement = screen.getByPlaceholderText(/Add a new task/i);
  fireEvent.change(inputElement, { target: { value: 'Test todo' } });
  expect(inputElement.value).toBe('Test todo');
});
