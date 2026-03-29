import { Navigate, createFileRoute } from "@tanstack/react-router";

import { isElectron } from "../env";
import { SidebarTrigger } from "../components/ui/sidebar";
import { Button } from "../components/ui/button";
import {
  authClient,
  connectGithub,
  openLinearConnect,
} from "../lib/auth";
import { useStore } from "../store";

function ChatIndexRouteView() {
  const { data: session } = authClient.useSession();
  const threads = useStore((store) => store.threads);
  const threadsHydrated = useStore((store) => store.threadsHydrated);
  const firstThread = threads[0] ?? null;
  const signedInUser = session?.user ?? null;

  if (threadsHydrated && firstThread) {
    return <Navigate to="/$threadId" params={{ threadId: String(firstThread.id) }} replace />;
  }

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col bg-background text-muted-foreground/40">
      {!isElectron && (
        <header className="border-b border-border px-3 py-2 md:hidden">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="size-7 shrink-0" />
            <span className="text-sm font-medium text-foreground">Tasks</span>
          </div>
        </header>
      )}

      {isElectron && (
        <div className="drag-region flex h-[52px] shrink-0 items-center border-b border-border px-5">
          <span className="text-xs text-muted-foreground/50">No tasks</span>
        </div>
      )}

      <div className="flex flex-1 items-center justify-center">
        {signedInUser ? (
          <div className="flex max-w-md flex-col items-center gap-4 px-6 text-center">
            <div className="space-y-2">
              <p className="text-sm text-foreground">Connect this account to get started.</p>
              <p className="text-sm text-muted-foreground">
                Repositories and tasks show up here after you connect Tennant to your tools.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Button variant="default" size="sm" onClick={() => void connectGithub()}>
                Connect GitHub
              </Button>
              <Button variant="outline" size="sm" onClick={openLinearConnect}>
                Connect Linear
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex max-w-md flex-col items-center gap-2 px-6 text-center">
            <p className="text-sm text-foreground">No tasks yet.</p>
            <p className="text-sm text-muted-foreground">
              When Tennant picks up work, tasks will show here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export const Route = createFileRoute("/_chat/")({
  component: ChatIndexRouteView,
});
