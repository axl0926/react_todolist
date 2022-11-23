import produce from "immer";
import styles from "../styles/Home.module.css";
import React, { useState } from "react";
import { sub, add, format } from "date-fns";
import create from "zustand";

interface TaskStore {
    tasks: { title: string; id: number; date: Date; isDone: boolean }[];
    date: Date;
    id: number;
    addTask: (tasks: { title: string; id: number; date: Date; isDone: boolean }) => void;
    increaseId: () => void;
    removeTask: (id: number) => void;
    checkTask: (id: number) => void;
    addDate: () => void;
    subDate: () => void;
}

const today = new Date(new Date().setHours(0, 0, 0, 0));
const useTaskStore = create<TaskStore>((set) => ({
    tasks: [
        {
            title: "클릭하면 체크",
            id: 0,
            date: today,
            isDone: false,
        },
        {
            title: "누르면 삭제>>",
            id: 1,
            date: today,
            isDone: false,
        },
    ],
    id: 2,
    date: today,
    addTask: (task) => set((state) => ({ tasks: [...state.tasks, task], id: state.id + 1 })),
    increaseId: () => set((state) => ({ id: state.id + 1 })),
    removeTask: (id) => set((state) => ({ tasks: state.tasks.filter((v) => v.id != id) })),
    checkTask: (id) => set((state) => ({ tasks: state.tasks.map((v) => (v.id === id ? { ...v, isDone: !v.isDone } : v)) })),
    addDate: () => set((state) => ({ date: add(state.date, { days: 1 }) })),
    subDate: () => set((state) => ({ date: sub(state.date, { days: 1 }) })),
}));
type List = { title: string; id: number; date: Date; checked: boolean };

function Home() {
    const tasks = useTaskStore((state) => state.tasks);
    const date = useTaskStore((state) => state.date);
    const addTasks = useTaskStore((state) => state.addTask);
    const addDate = useTaskStore((state) => state.addDate);
    const subDate = useTaskStore((state) => state.subDate);
    const removeTask = useTaskStore((state) => state.removeTask);
    const checkTask = useTaskStore((state) => state.checkTask);
   
    const [currentValue, setCurrentValue] = useState<{ title: string; date: Date }>({ title: "", date: date });
    const [currentId, setCurrentId] = useState<number>(12);
    const day = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
    

    const getTodayTask = () => {
        return tasks.filter((item) => format(item.date, "yyyy-MM-dd") === format(date, "yyyy-MM-dd"));
    };

    return (
        <div className={styles.contentsBox}>
            <div className={styles.listHeader}>
                <div className={styles.listDate}>
                    <div className={styles.date}>{`${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`}</div>
                    <div className={styles.btns}>
                        <button
                            onClick={() => {
                                addDate();
                            }}>
                            ▲
                        </button>
                        <button
                            onClick={() => {
                                subDate();
                            }}>
                            ▼
                        </button>
                    </div>
                </div>

                <div className={styles.day}>{day[date.getDay()]}</div>
                <div className={styles.leftovers}>{`오늘 할 일 ${getTodayTask().length}개 남음`}</div>
            </div>
            <div className={styles.listbox}>
                <ul>
                    {getTodayTask().map((item) => (
                        <div className={styles.listWrap} key={item.id}>
                            <li
                                className={styles.listNode}
                                data-checked={item.isDone}
                                onClick={() => {
                                    checkTask(item.id);
                                }}>
                                <span className={styles.list}>{`${item.title}   ${format(item.date, "MM/dd")}`}</span>
                            </li>
                            <button
                                className={styles.removeBtn}
                                onClick={() => {
                                    removeTask(item.id);
                                }}>
                                삭제
                            </button>
                        </div>
                    ))}
                </ul>
            </div>
            <div className={styles.inputForm}>
                <input
                    className={styles.inputTitle}
                    type="text"
                    placeholder="할 일 입력"
                    onChange={(e) =>
                        setCurrentValue(
                            produce(currentValue, (draft) => {
                                draft.title = e.target.value;
                            })
                        )
                    }
                />
                <input
                    className={styles.inputDate}
                    type="date"
                    // value={}
                    onChange={(e) => {
                        setCurrentValue(
                            produce(currentValue, (draft) => {
                                draft.date = new Date(e.target.value);
                            })
                        );
                        console.log(e.target.value);
                    }}
                />

                <button
                    onClick={() => {
                        addTasks({ ...currentValue, id: currentId, isDone: false });
                        setCurrentId(currentId + 1);
                    }}>
                    추가
                </button>
            </div>
        </div>
    );
}

export default Home;
