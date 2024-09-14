"use client";

import React, { useState, forwardRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendar } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { FaRegTrashAlt, FaPen, FaCheck, FaTimes } from "react-icons/fa";

interface TodoItem {
  id: number;
  text: string;
  dueDate: Date | null;
  completed: boolean;
  color: string; // Added color property
}

const DEFAULT_DUE_DATE = new Date(); // Default due date

// Predefined colors
const COLORS = [
  "#030711", // Black for less important
  "#0077b6", // Blue for important
  "#e63946", // Red for high importance
];

export function Todo() {
  const [dueDate, setDueDate] = useState<Date | null>(DEFAULT_DUE_DATE);
  const [newTodo, setNewTodo] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>(COLORS[0]); // Default color
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [fadeOutId, setFadeOutId] = useState<number | null>(null);
  const [editTodoId, setEditTodoId] = useState<number | null>(null);
  const [editText, setEditText] = useState<string>("");

  const CustomInput = forwardRef(({ value, onClick }: any) => (
    <button
      onClick={onClick}
      className="flex items-center px-2 py-1 border-2 border-slate-900 rounded h-10"
    >
      <FaCalendar className="mr-2" />
      <span>{value}</span>
    </button>
  ));

  const handleAddTodo = () => {
    if (newTodo.trim()) {
      const newTodoItem: TodoItem = {
        id: Date.now(),
        text: newTodo,
        dueDate: dueDate,
        completed: false,
        color: selectedColor, // Include selected color
      };
      setTodos([...todos, newTodoItem]);
      setNewTodo("");
      setDueDate(DEFAULT_DUE_DATE); // Reset due date to default
      setSelectedColor(COLORS[0]); // Reset color to default
    }
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const toggleTodoCompletion = (id: number) => {
    setTodos((prevTodos) => {
      const updatedTodos = prevTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      );

      const isCompleted = updatedTodos.find(
        (todo) => todo.id === id
      )?.completed;

      if (isCompleted) {
        setFadeOutId(id);
        // Delay the deletion to match the fade-out duration
        setTimeout(() => {
          deleteTodo(id);
        }, 500); // Ensure this matches the duration of the fade-out animation
      } else {
        setFadeOutId(null); // Reset fadeOutId if not completed
      }

      return updatedTodos;
    });
  };

  const startEditingTodo = (id: number, text: string) => {
    setEditTodoId(id);
    setEditText(text);
  };

  const saveEditedTodo = (id: number) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, text: editText } : todo
      )
    );
    setEditTodoId(null); // Reset edit mode
  };

  return (
    <div className="flex flex-col items-center my-10 px-4 sm:px-6 md:px-8 lg:px-12">
      <div className="flex flex-col items-center border border-slate-200 w-full max-w-lg rounded p-4 mb-10">
        <h1 className="text-3xl text-slate-300 mb-4 text-center">
          Create a task
        </h1>
        <div className="flex flex-col sm:flex-row items-center w-full gap-4 mb-4 justify-center">
          <input
            type="text"
            placeholder="ex. Go to the gym"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            className="w-full sm:w-60 px-2 py-1 border border-3 border-black rounded h-10"
          />
          <div className="flex justify-center w-full sm:w-auto">
            <DatePicker
              selected={dueDate}
              onChange={(date) => setDueDate(date)}
              customInput={<CustomInput />}
              dateFormat="dd/MM/yyyy"
              className="w-full"
            />
          </div>
          {/* Color Picker */}
          <div className="flex flex-col items-center w-full sm:w-auto">
            <label className="mb-2 text-slate-300">Choose color:</label>
            <div className="flex gap-2">
              {COLORS.map((color) => (
                <button
                  key={color}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                  className={`w-8 h-8 rounded-full border-2 ${
                    selectedColor === color
                      ? "border-black"
                      : "border-transparent"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
        <Button
          onClick={handleAddTodo}
          className="w-full sm:w-40 bg-slate-200 my-4 hover:bg-slate-800 hover:text-slate-200 border border-slate-300 transition duration-300 ease-in-out rounded text-slate-800 text-lg p-5"
        >
          Create
        </Button>
      </div>
      {/* Lista zadań */}
      <div className="w-full max-w-lg">
        <ul className="list-disc pl-4">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className={`border-b border-slate-500 py-2 flex justify-between m-3 ${
                todo.completed ? "line-through text-gray-500" : "text-white"
              } ${fadeOutId === todo.id ? "fade-out" : ""}`} // Apply fade-out class
              style={{ color: todo.color }} // Apply color to text
            >
              <div className="flex items-center">
                {editTodoId === todo.id ? (
                  <>
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="mr-2 px-2 py-1 border border-black rounded h-10"
                    />
                    <FaCheck
                      className="mr-2 cursor-pointer text-green-500"
                      onClick={() => saveEditedTodo(todo.id)}
                    />
                    <FaTimes
                      className="cursor-pointer text-red-500"
                      onClick={() => setEditTodoId(null)}
                    />
                  </>
                ) : (
                  <>
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleTodoCompletion(todo.id)}
                      className="mr-2 size-4"
                    />
                    {todo.text} -{" "}
                    {todo.dueDate
                      ? todo.dueDate.toLocaleDateString()
                      : "No due date"}
                    <FaPen
                      className="ml-2 cursor-pointer"
                      onClick={() => startEditingTodo(todo.id, todo.text)}
                    />
                  </>
                )}
              </div>
              <FaRegTrashAlt
                className="mr-5 cursor-pointer text-red-600"
                onClick={() => deleteTodo(todo.id)}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Todo;
