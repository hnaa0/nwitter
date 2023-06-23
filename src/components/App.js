import { useEffect, useState } from "react";
import AppRouter from "components/Router";
import { authService } from "fBase";
import styled from "styled-components";

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
        setUserObj({
          displayName: user.displayName,
          uid: user.uid,
          photoURL: user.photoURL,
          updateProfile: (args) => user.updateProfile(args),
        });
      } else {
        setUserObj(null);
      }
      setInit(true);
    });
  }, []);

  const refreshUser = () => {
    const user = authService.currentUser;
    setUserObj({
      displayName: user.displayName,
      uid: user.uid,
      updateProfile: (args) => user.updateProfile(args),
    });
  };

  return (
    <Wrapper>
      {init ? (
        <AppRouter
          refreshUser={refreshUser}
          isLoggedIn={Boolean(userObj)}
          userObj={userObj}
        />
      ) : (
        "Initializing.."
      )}
    </Wrapper>
  );
}

export default App;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
`;
