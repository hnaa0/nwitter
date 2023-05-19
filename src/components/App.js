import { useEffect, useState } from "react";
import AppRouter from "components/Router";
import { authService } from "fBase";

function App() {
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState(null);

  // authService.currentUser는 유저가 로그인되었는지 알 수 없음.
  // 왜냐하면 firebase가 실행되기 전에 app이 로딩되기 때문.

  useEffect(() => {
    // onAuthStateChnaged? => 사용자의 로그인 상태의 변화를 관찰하는 관찰자 추가.
    // 유저 상태에 변화가 있을 때 알아차림. 유저가 로그인-로그아웃할 떄, 계정을 생성할 때, firbase가 초기화될 때 실행
    authService.onAuthStateChanged((user) => {
      if (user) {
        setUserObj(user);
      }
      setInit(true);
    });
  }, []);

  return (
    <>
      {init ? (
        <AppRouter isLoggedIn={Boolean(userObj)} userObj={userObj} />
      ) : (
        "Initializing.."
      )}
      <footer>&copy; Nwitter {new Date().getFullYear()}</footer>
    </>
  );
}

export default App;
