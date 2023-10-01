import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import Root from './components/root';
import MainPage from './components/mainPage';
import SearchPlaylists from './components/searchPlaylists';
import { SpotifySdkContextProvider } from './provider/SpotifySdkProviders';
import './App.css'


function App() {

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={
        <SpotifySdkContextProvider>
          <Root />
        </SpotifySdkContextProvider>
      }>
        <Route index element={<MainPage />} />
        <Route path="playlists" element={<SearchPlaylists />} />
      </Route>
    )
  );
  return router;
}

export default App();