import Spinner from "@/components/spinner/Spinner";
import { lazy, Suspense } from "react";
import { BrowserRouter, Routes as ReactRoutes, Route } from "react-router-dom";


export default function Routes() {

    // note the components should be in src/pages
    const routesArr = [
        { uri: "/", component: "Index" },
        { uri: "/manifesto", component: "Manifesto" },
        { uri: "/mint", component: "Mint" },
        { uri: "/mint/claim", component: "ClaimToken" },
        // for test
        //{ uri: "/mint2", component: "Mint2" },

        { uri: "/leaderboard", component: "Leaderboard" },
        { uri: "/faq", component: "FAQ" },
        { uri: "/roadmap", component: "Roadmap" },
        { uri: "/clans", component: "Clans" },
        { uri: "/clans/:slugId", component: "ClanDetails" },
        { uri: "/profile/:usernameOrAddress", component: "Profile" },
        { uri: "/account", component: "Profile" },
        { uri: "/privacy", component: "Privacy" },
        { uri: "/terms", component: "Terms" },

        { uri: "/whitepaper", component: "Whitepaper" },

        { uri: "*", component: "NotFound" },
    ];

    return (
        <BrowserRouter>
            <ReactRoutes>
                { routesArr.map((item, idx) => {

                    const Component = lazy(() => import(`../pages/${item.component}.tsx`));

                    return (
                        <Route key={idx}
                            path={item.uri}
                            element={
                                <Suspense fallback={<Spinner className="w-screen h-screen" />}>
                                    <Component />
                                </Suspense>
                            }
                        />
                    )
                })}
            </ReactRoutes>
        </BrowserRouter>
    )
}
