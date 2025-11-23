  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);

  // Fetch user role
  useEffect(() => {
    const fetchUserRole = async () => {
      if (session?.user?.email) {
        try {
          const response = await fetch("/api/auth/me");
          const data = await response.json();
          if (data.success) {
            setUserRole(data.data.role);
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
        }
      }
    };

    if (status === "authenticated") {
      fetchUserRole();
    }
  }, [session, status]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // While checking session
  if (status === "loading" || !userRole) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#F4EEE8]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-rose-500 border-t-transparent"></div>
      </main>
    );
  }

  // Avoid flicker when redirecting
  if (!session) return null;

  const displayName = session.user?.name || session.user?.email || "User";
  const navItems = getNavItems(userRole);

  // Role badge color
  const getRoleBadge = () => {
    if (userRole === "admin") return { label: "Admin", color: "bg-purple-500" };
    if (userRole === "agent") return { label: "Agent", color: "bg-blue-500" };
    return { label: "Client", color: "bg-green-500" };
  };

  const roleBadge = getRoleBadge();

  return (
    <main className="min-h-screen bg-[#F4EEE8]">
      <div className="flex min-h-screen">
        {/* Sidebar (desktop) */}
        <aside className="hidden w-72 flex-col border-r border-slate-100 bg-white/95 px-5 py-6 shadow-sm backdrop-blur lg:flex">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-rose-500 text-white shadow-sm">
              <Building2 className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-semibold tracking-[0.25em] text-rose-500 uppercase">
                MetroNest
              </p>
              <p className="text-sm font-semibold text-slate-900">
                Dashboard
              </p>
            </div>
          </Link>

          {/* User Info */}
          <div className="mt-4 rounded-2xl bg-slate-50 px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center text-white font-semibold text-sm">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">{displayName}</p>
                <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium text-white ${roleBadge.color}`}>
                  {roleBadge.label}
                </span>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav className="mt-6 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex w-full items-center justify-between rounded-2xl px-3.5 py-2.5 text-sm transition ${
                    isActive
                      ? "bg-slate-900 text-slate-50 shadow-sm"
                      : "text-slate-600 hover:bg-slate-100/70"
                  }`}
                >
                  <span className="inline-flex items-center gap-2">
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-xl ${
                        isActive ? "bg-slate-800/80" : "bg-slate-100"
                      }`}
                    >
                      <Icon
                        className={`h-3.5 w-3.5 ${
                          isActive ? "text-rose-300" : "text-slate-500"
                        }`}
                      />
                    </span>
                    {item.label}
                  </span>
                  {isActive && (
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Logout Button */}
          <div className="mt-auto pt-4 border-t border-slate-100">
            <Link
              href="/api/auth/signout"
              className="flex w-full items-center gap-2 rounded-2xl px-3.5 py-2.5 text-sm text-slate-600 hover:bg-red-50 hover:text-red-600 transition"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </Link>
          </div>
        </aside>

        {/* Mobile sidebar */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 flex lg:hidden">
            <div
              className="fixed inset-0 bg-black/30"
              onClick={() => setSidebarOpen(false)}
            />
            <aside className="relative z-50 flex w-72 flex-col border-r border-slate-100 bg-white px-5 py-6 shadow-lg">
              <div className="flex items-center justify-between">
                <Link href="/dashboard" className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-rose-500 text-white">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <p className="text-sm font-semibold text-slate-900">
                    MetroNest
                  </p>
                </Link>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="rounded-full p-1.5 text-slate-500 hover:bg-slate-100"
                >
                  ✕
                </button>
              </div>

              {/* User Info Mobile */}
              <div className="mt-4 rounded-2xl bg-slate-50 px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center text-white font-semibold text-sm">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{displayName}</p>
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium text-white ${roleBadge.color}`}>
                      {roleBadge.label}
                    </span>
                  </div>
                </div>
              </div>

              <nav className="mt-6 space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex w-full items-center justify-between rounded-2xl px-3.5 py-2.5 text-sm transition ${
                        isActive
                          ? "bg-slate-900 text-slate-50 shadow-sm"
                          : "text-slate-600 hover:bg-slate-100/70"
                      }`}
                    >
                      <span className="inline-flex items-center gap-2">
                        <span
                          className={`flex h-7 w-7 items-center justify-center rounded-xl ${
                            isActive ? "bg-slate-800/80" : "bg-slate-100"
                          }`}
                        >
                          <Icon
                            className={`h-3.5 w-3.5 ${
                              isActive ? "text-rose-300" : "text-slate-500"
                            }`}
                          />
                        </span>
                        {item.label}
                      </span>
                    </Link>
                  );
                })}
              </nav>

              {/* Logout Mobile */}
              <div className="mt-auto pt-4 border-t border-slate-100">
                <Link
                  href="/api/auth/signout"
                  className="flex w-full items-center gap-2 rounded-2xl px-3.5 py-2.5 text-sm text-slate-600 hover:bg-red-50 hover:text-red-600 transition"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </Link>
              </div>
            </aside>
          </div>
        )}

        {/* Main content */}
        <div className="flex-1">
          {/* Top bar */}
          <header className="sticky top-0 z-20 border-b border-slate-100 bg-[#F4EEE8]/80 backdrop-blur">
            <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-3">
                <button
                  className="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm lg:hidden"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu className="h-4 w-4" />
                </button>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-rose-500">
                    {roleBadge.label} Dashboard
                  </p>
                  <h1 className="text-lg font-semibold text-slate-900 sm:text-xl md:text-2xl">
                    Welcome back, {displayName}
                  </h1>
                </div>
              </div>
            </div>
          </header>

          {/* Page content */}
          <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            {children}
          </div>
        </div>
      </div>
    </main>
  );
}