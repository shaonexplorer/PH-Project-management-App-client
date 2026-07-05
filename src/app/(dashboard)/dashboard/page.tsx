function Page() {
  return (
    <>
      {/* Stats Overview Section */}
      <div className="grid auto-rows-min gap-4 md:grid-cols-3 mb-6">
        <div className="rounded-2xl bg-card border border-border/50 shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-project-blue/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-project-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6h-6v-6h6V5v6M9 5v6M9 11v6" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground">Projects</h3>
              <p className="text-2xl font-bold text-foreground">12</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl bg-card border border-border/50 shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-status-inprogress/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-status-inprogress" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3M5 13a7 7 0 0114 0" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground">Active Tasks</h3>
              <p className="text-2xl font-bold text-foreground">24</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl bg-card border border-border/50 shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-status-completed/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-status-completed" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground">Completed</h3>
              <p className="text-2xl font-bold text-foreground">48</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="rounded-2xl bg-card border border-border/50 shadow-lg p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">Recent Activity</h2>
        <div className="bg-muted/30 rounded-xl p-4">
          <div className="text-center py-12 text-muted-foreground">
            <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center mb-3">
              <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3M5 13a7 7 0 0114 0" />
              </svg>
            </div>
            <p className="text-sm text-muted-foreground">No recent activity yet</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Page;
