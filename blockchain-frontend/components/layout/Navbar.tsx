"use client";

import {
  Bell,
  ChevronDown,
  Search,
  User,
  LogOut,
  Settings,
  CheckCheck,
  X,
} from "lucide-react";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";


interface UserType {
  name: string;
  role: string;
}


interface NotificationType {
  id: number;
  title: string;
  message: string;
  type: string | null;
  isRead: boolean;
  createdAt: string;
}


interface SearchItem {
  title: string;
  keywords: string[];
  href: string;
  roles: string[];
}


const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5555";


const searchItems: SearchItem[] = [

  {
    title: "Dashboard",
    keywords: [
      "dashboard",
      "home",
      "main"
    ],
    href: "/dashboard",
    roles: [
      "STUDENT",
      "UNIVERSITY",
      "EMPLOYER",
      "ADMIN"
    ]
  },

  {
    title: "My Profile",
    keywords: [
      "profile",
      "account",
      "my profile"
    ],
    href: "/profile",
    roles: [
      "STUDENT",
      "UNIVERSITY",
      "EMPLOYER",
      "ADMIN"
    ]
  },

  {
    title: "Settings",
    keywords: [
      "settings",
      "setting",
      "preferences"
    ],
    href: "/settings",
    roles: [
      "STUDENT",
      "UNIVERSITY",
      "EMPLOYER",
      "ADMIN"
    ]
  },

  {
    title: "My Documents",
    keywords: [
      "documents",
      "document",
      "certificate",
      "certificates",
      "my documents"
    ],
    href: "/documents",
    roles: [
      "STUDENT"
    ]
  },

  {
    title: "Student Dashboard",
    keywords: [
      "student dashboard",
      "dashboard",
      "student"
    ],
    href: "/student/dashboard",
    roles: [
      "STUDENT"
    ]
  },

  {
    title: "University Dashboard",
    keywords: [
      "university dashboard",
      "dashboard",
      "university"
    ],
    href: "/university/dashboard",
    roles: [
      "UNIVERSITY"
    ]
  },

  {
    title: "Issue Certificate",
    keywords: [
      "issue",
      "issue certificate",
      "upload",
      "upload certificate",
      "new certificate",
      "certificate"
    ],
    href: "/university/upload",
    roles: [
      "UNIVERSITY"
    ]
  },

  {
    title: "University Certificates",
    keywords: [
      "certificates",
      "certificate",
      "issued certificates",
      "manage certificates"
    ],
    href: "/university/certificates",
    roles: [
      "UNIVERSITY"
    ]
  },

  {
    title: "Employer Dashboard",
    keywords: [
      "employer dashboard",
      "dashboard",
      "employer"
    ],
    href: "/employer/dashboard",
    roles: [
      "EMPLOYER"
    ]
  },

  {
    title: "Verification History",
    keywords: [
      "history",
      "verification history",
      "verified",
      "past verifications"
    ],
    href: "/employer/history",
    roles: [
      "EMPLOYER"
    ]
  },

  {
    title: "Admin Dashboard",
    keywords: [
      "admin dashboard",
      "dashboard",
      "admin"
    ],
    href: "/admin/dashboard",
    roles: [
      "ADMIN"
    ]
  },

  {
    title: "Manage Users",
    keywords: [
      "users",
      "user",
      "manage users"
    ],
    href: "/admin/users",
    roles: [
      "ADMIN"
    ]
  },

  {
    title: "Manage Certificates",
    keywords: [
      "certificates",
      "certificate",
      "manage certificates"
    ],
    href: "/admin/certificates",
    roles: [
      "ADMIN"
    ]
  },

  {
    title: "Reports",
    keywords: [
      "reports",
      "report",
      "analytics"
    ],
    href: "/admin/reports",
    roles: [
      "ADMIN"
    ]
  }

];


export default function Navbar() {

  const router =
    useRouter();


  const [user, setUser] =
    useState<UserType | null>(
      null
    );


  const [open, setOpen] =
    useState(false);


  const [
    notificationOpen,
    setNotificationOpen
  ] = useState(false);


  const [
    notifications,
    setNotifications
  ] = useState<NotificationType[]>(
    []
  );


  const [
    loadingNotifications,
    setLoadingNotifications
  ] = useState(false);


  const [
    searchQuery,
    setSearchQuery
  ] = useState("");


  const [
    searchOpen,
    setSearchOpen
  ] = useState(false);


  const dropdownRef =
    useRef<HTMLDivElement>(
      null
    );


  const notificationRef =
    useRef<HTMLDivElement>(
      null
    );


  const searchRef =
    useRef<HTMLDivElement>(
      null
    );


  const formatNotificationTime = (
    dateString: string
  ) => {

    const date =
      new Date(
        dateString
      );


    const now =
      new Date();


    const difference =
      now.getTime() -
      date.getTime();


    const seconds =
      Math.floor(
        difference / 1000
      );


    const minutes =
      Math.floor(
        seconds / 60
      );


    const hours =
      Math.floor(
        minutes / 60
      );


    const days =
      Math.floor(
        hours / 24
      );


    if (seconds < 60) {
      return "Just now";
    }


    if (minutes < 60) {
      return `${minutes}m ago`;
    }


    if (hours < 24) {
      return `${hours}h ago`;
    }


    if (days === 1) {
      return "Yesterday";
    }


    if (days < 7) {
      return `${days}d ago`;
    }


    return date.toLocaleDateString();

  };


  const fetchNotifications =
    async () => {

      try {

        const token =
          localStorage.getItem(
            "token"
          );


        if (!token) {

          setNotifications(
            []
          );

          return;

        }


        setLoadingNotifications(
          true
        );


        const response =
          await fetch(

            `${API_URL}/notifications`,

            {

              headers: {

                Authorization:
                  `Bearer ${token}`

              },

              cache:
                "no-store"

            }

          );


        if (!response.ok) {

          if (
            response.status ===
            401
          ) {

            setNotifications(
              []
            );

          }

          return;

        }


        const data =
          await response.json();


        setNotifications(

          Array.isArray(
            data.notifications
          )

            ? data.notifications

            : []

        );

      } catch (error) {

        console.error(
          "Failed to fetch notifications:",
          error
        );

      } finally {

        setLoadingNotifications(
          false
        );

      }

    };


  useEffect(() => {

    const stored =
      localStorage.getItem(
        "user"
      );


    if (stored) {

      try {

        setUser(
          JSON.parse(
            stored
          )
        );

      } catch {

        setUser(
          null
        );

      }

    }


    fetchNotifications();


    const interval =
      setInterval(

        fetchNotifications,

        15000

      );


    function handleClickOutside(
      event: MouseEvent
    ) {

      const target =
        event.target as Node;


      if (

        dropdownRef.current &&

        !dropdownRef.current.contains(
          target
        )

      ) {

        setOpen(
          false
        );

      }


      if (

        notificationRef.current &&

        !notificationRef.current.contains(
          target
        )

      ) {

        setNotificationOpen(
          false
        );

      }


      if (

        searchRef.current &&

        !searchRef.current.contains(
          target
        )

      ) {

        setSearchOpen(
          false
        );

      }

    }


    document.addEventListener(
      "mousedown",
      handleClickOutside
    );


    return () => {

      clearInterval(
        interval
      );


      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );

    };

  }, []);


  const logout = () => {

    localStorage.removeItem(
      "token"
    );


    localStorage.removeItem(
      "user"
    );


    setNotifications(
      []
    );


    router.push(
      "/login"
    );

  };


  const unreadCount =
    notifications.filter(

      notification =>
        !notification.isRead

    ).length;


  const searchResults =
    searchItems.filter(
      item => {

        const role =
          user?.role ||
          "STUDENT";


        if (
          !item.roles.includes(
            role
          )
        ) {
          return false;
        }


        const query =
          searchQuery
            .trim()
            .toLowerCase();


        if (!query) {
          return false;
        }


        return (

          item.title
            .toLowerCase()
            .includes(
              query
            ) ||

          item.keywords.some(
            keyword =>
              keyword
                .toLowerCase()
                .includes(
                  query
                )
          )

        );

      }
    );


  const handleSearch =
    (
      event:
        React.FormEvent<HTMLFormElement>
    ) => {

      event.preventDefault();


      if (
        searchResults.length > 0
      ) {

        router.push(
          searchResults[0].href
        );


        setSearchQuery(
          ""
        );


        setSearchOpen(
          false
        );

      }

    };


  const selectSearchResult =
    (
      href: string
    ) => {

      router.push(
        href
      );


      setSearchQuery(
        ""
      );


      setSearchOpen(
        false
      );

    };


  const toggleNotifications =
    async () => {

      setNotificationOpen(
        current => !current
      );


      setOpen(
        false
      );


      setSearchOpen(
        false
      );


      await fetchNotifications();

    };


  const markAsRead =
    async (
      id: number
    ) => {

      try {

        const token =
          localStorage.getItem(
            "token"
          );


        if (!token) {
          return;
        }


        const notification =
          notifications.find(

            item =>
              item.id === id

          );


        if (
          notification?.isRead
        ) {
          return;
        }


        const response =
          await fetch(

            `${API_URL}/notifications/${id}/read`,

            {

              method:
                "PUT",

              headers: {

                Authorization:
                  `Bearer ${token}`,

                "Content-Type":
                  "application/json"

              }

            }

          );


        if (
          response.ok
        ) {

          setNotifications(
            currentNotifications =>

              currentNotifications.map(
                notification =>

                  notification.id === id

                    ? {
                        ...notification,
                        isRead: true
                      }

                    : notification
              )
          );

        }

      } catch (error) {

        console.error(
          "Failed to mark notification as read:",
          error
        );

      }

    };


  const markAllAsRead =
    async () => {

      try {

        const token =
          localStorage.getItem(
            "token"
          );


        if (!token) {
          return;
        }


        const response =
          await fetch(

            `${API_URL}/notifications/mark-all-read`,

            {

              method:
                "PUT",

              headers: {

                Authorization:
                  `Bearer ${token}`,

                "Content-Type":
                  "application/json"

              }

            }

          );


        if (
          response.ok
        ) {

          setNotifications(
            currentNotifications =>

              currentNotifications.map(
                notification => ({

                  ...notification,

                  isRead:
                    true

                })
              )
          );

        }

      } catch (error) {

        console.error(
          "Failed to mark all notifications as read:",
          error
        );

      }

    };


  const removeNotification =
    async (

      event:
        React.MouseEvent<HTMLButtonElement>,

      id:
        number

    ) => {

      event.stopPropagation();


      try {

        const token =
          localStorage.getItem(
            "token"
          );


        if (!token) {
          return;
        }


        const response =
          await fetch(

            `${API_URL}/notifications/${id}`,

            {

              method:
                "DELETE",

              headers: {

                Authorization:
                  `Bearer ${token}`

              }

            }

          );


        if (
          response.ok
        ) {

          setNotifications(
            currentNotifications =>

              currentNotifications.filter(

                notification =>
                  notification.id !== id

              )
          );

        }

      } catch (error) {

        console.error(
          "Failed to delete notification:",
          error
        );

      }

    };


  return (

    <header className="h-24 bg-[#0F172A] border-b border-slate-800 px-10 flex items-center justify-between">

      <div
        ref={searchRef}
        className="relative w-[420px]"
      >

        <form
          onSubmit={handleSearch}
        >

          <Search
            size={20}
            className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            value={searchQuery}
            onChange={event => {

              setSearchQuery(
                event.target.value
              );

              setSearchOpen(
                true
              );

            }}
            onFocus={() => {

              if (
                searchQuery.trim()
              ) {

                setSearchOpen(
                  true
                );

              }

            }}
            placeholder="Search anything..."
            className="w-full rounded-xl bg-[#111827] border border-slate-700 py-4 pl-14 pr-4 text-white outline-none focus:border-cyan-400"
          />

        </form>


        {searchOpen &&
        searchQuery.trim() && (

          <div className="absolute left-0 right-0 mt-3 bg-[#111827] border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50">

            {searchResults.length > 0 ? (

              <div>

                {searchResults.map(
                  item => (

                    <button
                      key={item.href}
                      onClick={() =>
                        selectSearchResult(
                          item.href
                        )
                      }
                      className="w-full flex items-center gap-3 px-5 py-4 text-left text-white hover:bg-slate-800 transition border-b border-slate-800 last:border-b-0"
                    >

                      <Search
                        size={18}
                        className="text-cyan-400"
                      />

                      <span>
                        {item.title}
                      </span>

                    </button>

                  )
                )}

              </div>

            ) : (

              <div className="px-5 py-5 text-slate-400 text-sm">

                No matching pages found

              </div>

            )}

          </div>

        )}

      </div>


      <div className="flex items-center gap-8">

        <div
          ref={notificationRef}
          className="relative"
        >

          <button
            onClick={toggleNotifications}
            className="relative p-2 rounded-xl hover:bg-slate-800 transition"
            aria-label="Notifications"
          >

            <Bell
              className="text-white"
              size={24}
            />

            {unreadCount > 0 && (

              <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-red-500 text-xs flex items-center justify-center text-white">

                {unreadCount > 9
                  ? "9+"
                  : unreadCount}

              </span>

            )}

          </button>


          {notificationOpen && (

            <div className="absolute right-0 mt-4 w-[420px] bg-[#111827] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden z-50">

              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700">

                <div>

                  <h3 className="text-white font-bold text-lg">
                    Notifications
                  </h3>

                  <p className="text-slate-400 text-sm mt-1">

                    {unreadCount > 0

                      ? `${unreadCount} unread notification${
                          unreadCount > 1
                            ? "s"
                            : ""
                        }`

                      : "You're all caught up"}

                  </p>

                </div>


                {unreadCount > 0 && (

                  <button
                    onClick={markAllAsRead}
                    className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm"
                  >

                    <CheckCheck
                      size={17}
                    />

                    Mark all read

                  </button>

                )}

              </div>


              <div className="max-h-[400px] overflow-y-auto">

                {loadingNotifications &&
                notifications.length === 0 ? (

                  <div className="py-12 px-6 text-center">

                    <p className="text-slate-400">
                      Loading notifications...
                    </p>

                  </div>

                ) : notifications.length === 0 ? (

                  <div className="py-12 px-6 text-center">

                    <Bell
                      size={40}
                      className="mx-auto text-slate-600"
                    />

                    <p className="text-slate-400 mt-4">
                      No notifications
                    </p>

                    <p className="text-slate-500 text-sm mt-1">
                      You're all caught up!
                    </p>

                  </div>

                ) : (

                  notifications.map(
                    notification => (

                      <div
                        key={notification.id}
                        onClick={() =>
                          markAsRead(
                            notification.id
                          )
                        }
                        className={`group relative px-5 py-4 border-b border-slate-800 cursor-pointer transition hover:bg-slate-800 ${
                          !notification.isRead
                            ? "bg-cyan-500/5"
                            : ""
                        }`}
                      >

                        {!notification.isRead && (

                          <span className="absolute left-2 top-6 h-2 w-2 rounded-full bg-cyan-400" />

                        )}


                        <div className="pr-8">

                          <div className="flex items-center justify-between gap-4">

                            <h4 className="text-white font-semibold">

                              {notification.title}

                            </h4>


                            <span className="text-xs text-slate-500 whitespace-nowrap">

                              {formatNotificationTime(
                                notification.createdAt
                              )}

                            </span>

                          </div>


                          <p className="text-sm text-slate-400 mt-1">

                            {notification.message}

                          </p>

                        </div>


                        <button
                          onClick={event =>
                            removeNotification(
                              event,
                              notification.id
                            )
                          }
                          className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition"
                          aria-label="Remove notification"
                        >

                          <X
                            size={17}
                          />

                        </button>

                      </div>

                    )
                  )

                )}

              </div>

            </div>

          )}

        </div>


        <div className="h-10 w-px bg-slate-700" />


        <div
          ref={dropdownRef}
          className="relative"
        >

          <button
            onClick={() => {

              setOpen(
                !open
              );

              setNotificationOpen(
                false
              );

              setSearchOpen(
                false
              );

            }}
            className="flex items-center gap-4"
          >

            <div className="h-14 w-14 rounded-full bg-cyan-500 flex items-center justify-center text-white font-bold text-2xl">

              {user?.name
                ?.charAt(0)
                .toUpperCase() || "U"}

            </div>


            <div className="text-left">

              <h3 className="text-white font-bold text-xl">

                {user?.name || "User"}

              </h3>


              <p className="text-cyan-400 uppercase">

                {user?.role || "Student"}

              </p>

            </div>


            <ChevronDown
              className="text-white"
            />

          </button>


          {open && (

            <div className="absolute right-0 mt-4 w-64 bg-[#111827] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden z-50">

              <button
                onClick={() => {

                  router.push(
                    "/profile"
                  );

                  setOpen(
                    false
                  );

                }}
                className="flex items-center gap-4 w-full px-6 py-4 hover:bg-slate-800 text-white"
              >

                <User
                  size={20}
                />

                My Profile

              </button>


              <button
                onClick={() => {

                  router.push(
                    "/settings"
                  );

                  setOpen(
                    false
                  );

                }}
                className="flex items-center gap-4 w-full px-6 py-4 hover:bg-slate-800 text-white"
              >

                <Settings
                  size={20}
                />

                Settings

              </button>


              <button
                onClick={logout}
                className="flex items-center gap-4 w-full px-6 py-4 hover:bg-red-600 text-red-400 hover:text-white"
              >

                <LogOut
                  size={20}
                />

                Logout

              </button>

            </div>

          )}

        </div>

      </div>

    </header>

  );

}