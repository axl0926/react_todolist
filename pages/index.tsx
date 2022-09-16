
import produce from "immer";
import styles from "../styles/Home.module.css";
import React, { useState } from "react";
import { sub, add, format } from "date-fns";

type List = { title: string; id: number; date: Date; checked: boolean };

function Home() {
    const [list, setList] = useState<List[]>([
        { title: "탕수육먹기", id: 0, date: new Date("2022-08-23"), checked: false },
        { title: "탕수육뱉기", id: 1, date: new Date("2022-08-23"), checked: false },
        { title: "치킨먹기", id: 2, date: new Date("2022-08-25"), checked: false },
        { title: "피자먹기", id: 3, date: new Date("2022-08-24"), checked: false },
        { title: "치킨뱉기", id: 4, date: new Date("2022-08-24"), checked: false },
        { title: "피자뱉기", id: 5, date: new Date("2022-08-24"), checked: false },
        { title: "리액트먹기", id: 6, date: new Date("2022-08-23"), checked: false },
        { title: "삼겹살먹기", id: 7, date: new Date("2022-08-23"), checked: false },
        { title: "치킨먹기", id: 8, date: new Date("2022-08-25"), checked: false },
        { title: "리액트뱉기", id: 9, date: new Date("2022-08-23"), checked: false },
        { title: "삼겹살뱉기", id: 10, date: new Date("2022-08-23"), checked: false },
        { title: "치킨먹기", id: 11, date: new Date("2022-08-25"), checked: false },
    ]);
    const [date, setDate] = useState(new Date());
    const [currentValue, setCurrentValue] = useState<{ title: string; date: Date }>({ title: "", date: date });
    const [currentId, setCurrentId] = useState<number>(12);
    const day = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];

    const getTodayTask = () => {
        return list.filter((item) => format(item.date, "yyyy-MM-dd") === format(date, "yyyy-MM-dd"));
    };
    const removeTask = (id: number) => {
        setList(list.filter((v) => v.id != id));
    };
    const addTask = (data: List) => {
        setList(
            produce(list, (draft) => {
                draft.push(data);
            })
        );
    };
    const checkTask = (id: number) => {
        setList(list.map((v) => (v.id === id ? { ...v, checked: !v.checked } : v)));
    };

    return (
        <div className={styles.contentsBox}>
            <div className={styles.listHeader}>
                <div className={styles.listDate}>
                    <div className={styles.date}>{`${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`}</div>
                    <div className={styles.btns}>
                        <button
                            onClick={() => {
                                setDate(add(date, { days: 1 }));
                            }}>
                            ▲
                        </button>
                        <button
                            onClick={() => {
                                setDate(sub(date, { days: 1 }));
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
                                data-checked={item.checked}
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
                    value={format(date, "yyyy-MM-dd")}
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
                        addTask({ ...currentValue, id: currentId, checked: false });
                        setCurrentId(currentId + 1);
                    }}>
                    추가
                </button>
            </div>
        </div>
    );
}

export default Home;
