import Spinner from "@/components/spinner/Spinner";
import EventBus from "@/core/EventBus";
import usePageView from "@/hooks/usePageView";
import StoriesLayout from "@/layouts/StoriesLayout.tsx";

import {
  lazy,
  Suspense,
  useEffect,
  FC,
  ReactNode
} from "react";

import {
  BrowserRouter,
  Routes as ReactRoutes,
  Route,
  useNavigate
} from "react-router-dom";

/**
 * 🔥 Vite glob import (FIXES dynamic import issue)
 */
const pages = import.meta.glob("../pages/**/*.tsx");

/**
 * 🧠 Safe lazy loader
 */
const load = (path: string) => {
  const key = `../pages/${path}.tsx`;

  const importer = pages[key];

  if (!importer) {
    console.error("Missing page:", key);
    return lazy(() => import("../pages/NotFound.tsx"));
  }

  return lazy(importer as any);
};

/**
 * 🧱 Route config
 */
const routesArr = [
  { path: "/", component: "Index" },
  { path: "/manifesto", component: "Manifesto" },
  { path: "/mint", component: "Mint" },
  { path: "/mint/claim", component: "ClaimToken" },
  { path: "/staking", component: "Staking" },

  // ✅ Layout route
  {
    path: "/stories",
    layout: StoriesLayout,
    children: [
      { index: true, component: "stories/PostsHome" },
      { path: "saved", component: "stories/Bookmarks" },
      { path: "/my-clans", component: "stories/UserClans" },
      ///{ path: "/clan/:clanSlug/posts", component: "stories/UserClans" },
      { path: "posts/:postId", component: "stories/PostItem" },
    ]
  },

  { path: "/r/:clanId", component: "Referral" },
  { path: "/r/:clanId/:userAccountId", component: "Referral" },

  { path: "/leaderboard", component: "Leaderboard" },
  { path: "/faq", component: "FAQ" },
  { path: "/roadmap", component: "Roadmap" },
  { path: "/clans", component: "Clans" },
  { path: "/clans/:slugId", component: "ClanDetails" },
  { path: "/profile/:usernameOrAddress", component: "Profile" },
  { path: "/account", component: "Profile" },
  { path: "/privacy", component: "Privacy" },
  { path: "/terms", component: "Terms" },
  { path: "/whitepaper", component: "Whitepaper" },

  { path: "*", component: "NotFound" }
];

/**
 * 🔁 Recursive route builder
 */
function renderRoutes(routes: any[]): ReactNode {
  return routes.map((route, idx) => {
    // 🧱 Layout route
    if (route.layout && route.children) {
      const Layout = route.layout;

      return (
        <Route key={idx} path={route.path} element={<Layout />}>
          {renderRoutes(route.children)}
        </Route>
      );
    }

    // 📄 Normal route
    const Component = load(route.component);

    return (
      <Route
        key={idx}
        path={route.index ? undefined : route.path}
        index={route.index}
        element={
          <Suspense fallback={<Spinner className="w-screen h-screen" />}>
            <Component />
          </Suspense>
        }
      />
    );
  });
}

/**
 * 🚀 Main Router
 */
export default function Routes() {
  return (
    <BrowserRouter>
      <NavigationComp />

      <ReactRoutes>
        {renderRoutes(routesArr)}
      </ReactRoutes>
    </BrowserRouter>
  );
}

/**
 * 🔁 Navigation bridge (EventBus → Router)
 */
const NavigationComp: FC = () => {
  const navigate = useNavigate();

  usePageView();

  useEffect(() => {
    const handler = (uri: string) => navigate(uri);

    EventBus.on("navigate", handler);

    return () => {
      EventBus.off("navigate", handler);
    };
  }, [navigate]);

  return null;
};
