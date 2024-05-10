import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";
import { isBot } from "next/dist/server/web/spec-extension/user-agent";

export const App = () => {
  // useState---------------------------------------
  const [todoText, setTodoText] = useState("");
  const [todoIncomplete, setTodoIncomplete] = useState({
    TODO1: { date: "20230211", isOverdueDate: false },
    TODO2: { date: "20251106", isOverdueDate: false },
    TODO3: { date: "20251106", isOverdueDate: false },

  });
  const [todoComplete, setTodoComplete] = useState({
    完了1: { date: "20240427", isOverdueDate: false },
    完了2: { date: "20251106", isOverdueDate: false },
  });
  const [switching, setSwitching] = useState(true);
  const [dueDate, setdueDate] = useState("");
  //--------------------------------------------------


  //inputのテキスト反映
  const onChangeTodoText = (event) => setTodoText(event.target.value);
  const onChangeDueDate = (event) => setdueDate(event.target.value);

  //数字チェック関数(数字かどうかの正規表現チェック)
  const numberCheck = (checkdate) => {
    const pattern = /^[-]?([1-9]\d*|0)(\.\d+)?$/;
    return pattern.test(checkdate);
  };

  //YYYYMMDD正規表現チェック変数
  const regex = /^[0-9]{4}(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])$/;
  console.log(!regex.test("2024/22/08") + "これは正規表現のやつ");

  //日付期限チェック処理
  const checkExpiration = () => {
    // 年・月・日・曜日を取得
    const currentDate = new Date(); //現在日付
    //期限が過ぎてるものを入れる変数
    let alertMessge=false
    // 日付が過ぎているものを全て調べる
    const updateTodos = Object.keys(todoIncomplete).reduce((overdueDate, key) => {
      const item = { ...todoIncomplete[key] };
      const { date } = item;
      
        console.log(
          JSON.stringify(overdueDate, null, 2) +  "これはtodoIncomplete[key]の中身です"
        );
        const year = date.slice(0, 4);
        const month = date.slice(4, 6);
        const day = date.slice(6, 8);
        const todoDate = new Date(year, month - 1, day); // TODOの日付をDateオブジェクトとして作成
        if (todoDate < currentDate) {
          // ここで期限切れ日付isOverdueDateをtrueにする
          item.isOverdueDate=true;
          alertMessge=true
        }else{
          item.isOverdueDate=false;
        }
        overdueDate[key] = item;
        return overdueDate;
      },{});
      if(alertMessge){
        alert('期限切れがのものがあります。確認してください')
      }else{
        alert('期限切れのものはありません')
      }
    setTodoIncomplete(updateTodos)
    
  };
  console.log(
    JSON.stringify(todoIncomplete, null, 2) + "これはtodoIncompleteのtrue"
  );

  // 日付のフォーマット処理
  const formatDate = (date) => {
    const year = date.slice(0, 4);
    const month = date.slice(4, 6);
    const day = date.slice(6, 8);

    const formattedDate = `${year}/${month}/${day}`;
    console.log("最終的なフォーマット: " + formattedDate);
    return formattedDate;
  };

  let flg = true; //correctInputCheckの判定フラグ
  //フォーマットチェック関数
  const correctInputCheck = () => {
    if (todoText === "") {
      alert("TODOを入力してください");
      flg = true;
    }
    if (dueDate === "") {
      alert("期限が入力されていません。");
      flg = true;
    }
    if (!numberCheck(dueDate)) {
      alert("日付は数字で入力してください");
      flg = true;
    }
    if (!regex.test(dueDate)) {
      alert("YYYYMMDD形式で入力してください");
      flg = true;
    }
  };

  const clickAdd = () => {
    correctInputCheck();
    if (!flg) {
      //flgがtrueなら実行する
      const newTodo = {
        ...todoIncomplete,
        [todoText]: { date: dueDate, isOverdueDate: false },
      };
      setTodoIncomplete(newTodo);
      setTodoText("");
      setdueDate("");
    }
    flg = false; //flgの初期化
  };
  // 完了クリック処理
  const clickTodoComplete = (index) => {
    const keys = Object.keys(todoIncomplete); // オブジェクトのすべてのキーを取得
    console.log(keys + "keysのすべてが入っています");
    const key = keys[index]; // 正しいキーをインデックスから取得(TODO)
    const date = todoIncomplete[key]; // キーに基づいた値を取得(日付)

    const newCompleteText = { ...todoComplete, [key]: date };
    setTodoComplete(newCompleteText);

    const newIncompleteText = { ...todoIncomplete };
    delete newIncompleteText[key]; // 未完了リストからキーを使って削除
    setTodoIncomplete(newIncompleteText);
  };

  const clickTodoDelete = (index) => {
    //削除クリック処理
    const keys = Object.keys(todoIncomplete);
    const key = keys[index];

    const newIncompleteText = { ...todoIncomplete };
    delete newIncompleteText[key];
    setTodoIncomplete(newIncompleteText);
  };

  //未着手クリック処理
  const clickNotStarted = (index) => {
    const keys = Object.keys(todoComplete);
    const key = keys[index];
    const date = todoComplete[key];

    const newComplete = { ...todoComplete };
    delete newComplete[key];
    setTodoComplete(newComplete);

    const newIncomplete = { ...todoIncomplete, [key]: date };
    //setTodoIncompleteは単一の引数しか受け取れない、複数ダメ
    setTodoIncomplete(newIncomplete);
  };
  //TODO一覧切り替え変数
  const switchingDisplay = () => {
    setSwitching(!switching);
  };
  return (
    <>
      <div className="all-todo">
        <h1 className="TODO">TODO</h1>
        {/* TODO切り替えボタン */}
        <button onClick={switchingDisplay}>TODO切り替え</button>
        {/* 期限チェックボタン */}
        <button onClick={checkExpiration}>日付期限チェック</button>
        <div className="input-area">
          <input
            onChange={onChangeTodoText}
            value={todoText}
            placeholder="TODOを入力してください"
          />
          <input
            onChange={onChangeDueDate}
            value={dueDate}
            placeholder="期限を入力してださい"
          />
          <button onClick={clickAdd}>追加</button>
        </div>
        {switching && (
          <div className="incomplete-area">
            <p className="title">未着手のTODO一覧</p>
            <ul>
              {Object.entries(todoIncomplete).map(
                ([key, { date, isOverdueDate }], index) => {
                  return (
                    <li key={key} className={isOverdueDate ? "overdue" : ""}>
                      {" "}
                      {/*className={overdueDate?'overdue':''}   overdyeDateがtrueになればclassNameを付与する*/}
                      <div className="list-row">
                        {/* {checkExpiration(index)} */}
                        <p className="p-index">{index}</p>
                        <p>：</p>
                        <p className="todo-item">{key}</p>
                        <button onClick={() => clickTodoComplete(index)}>
                          完了
                        </button>
                        <button onClick={() => clickTodoDelete(index)}>
                          削除
                        </button>
                        <p className="dueDateP">期限{formatDate(date)}</p>
                      </div>
                    </li>
                  );
                }
              )}
            </ul>
          </div>
        )}
        {switching || (
          <div className="complete-area">
            <p className="title">完了のTODO一覧</p>
            <ul>
              {Object.entries(todoComplete).map(
                ([key, { date, isOverdueDate }], index) => {
                  return (
                    <li key={key}>
                      <div className="list-row">
                        <p className="p-index">{index}</p>
                        <p>：</p>
                        <p className="todo-item">{key}</p>
                        <button onClick={() => clickNotStarted(index)}>
                          未着手
                        </button>
                        <p className="dueDateP">期限{formatDate(date)}</p>
                      </div>
                    </li>
                  );
                }
              )}
            </ul>
          </div>
        )}
      </div>
    </>
  );
};
