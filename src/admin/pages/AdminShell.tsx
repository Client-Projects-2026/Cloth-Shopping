import type { ReactNode } from 'react';
import {
  AlertCircle,
  ArrowUpRight,
  CheckCircle2,
  ChevronRight,
  EyeOff,
  Image as ImageIcon,
  LayoutDashboard,
  LogOut,
  Plus,
  ShieldCheck,
  Shirt,
  ShoppingBag,
} from 'lucide-react';
import type { AdminPage } from '../model';

const labels: Record<AdminPage, string> = {
  overview: 'Overview',
  inventory: 'Rack inventory',
  add: 'Add product',
  guide: 'Image guide',
  editor: 'Edit product',
  everyday: 'Everyday collection',
};
const navigation: { page: AdminPage; icon: typeof LayoutDashboard; caption: string }[] = [
  { page: 'overview', icon: LayoutDashboard, caption: 'Your shop at a glance' },
  { page: 'inventory', icon: Shirt, caption: 'Manage the five hangers' },
  { page: 'everyday', icon: ShoppingBag, caption: 'Pieces for real life' },
  { page: 'add', icon: Plus, caption: 'Publish a new look' },
  { page: 'guide', icon: ImageIcon, caption: 'Prepare product photos' },
];

interface Props {
  page: AdminPage;
  preview: boolean;
  notice: string;
  error: string;
  onNavigate: (page: AdminPage) => void;
  onExit: () => void | Promise<void>;
  children: ReactNode;
}

export default function AdminShell({
  page,
  preview,
  notice,
  error,
  onNavigate,
  onExit,
  children,
}: Props) {
  return (
    <div className="admin-app">
      <aside className="admin-sidebar">
        <div>
          <a href="/" className="admin-brand">
            THE SUNDAY <i>EDIT</i>
            <span>.</span>
            <small>STUDIO / ADMIN</small>
          </a>
          <div className="admin-workspace">
            <span className="admin-workspace-mark">S</span>
            <div>
              <strong>Shop workspace</strong>
              <small>{preview ? 'Read-only preview' : 'Live catalog'}</small>
            </div>
          </div>
          <p className="admin-sidebar-label">WORKSPACE</p>
          <nav aria-label="Admin navigation">
            {navigation.map(({ page: target, icon: Icon, caption }) => (
              <button
                key={target}
                className={
                  page === target || (page === 'editor' && target === 'inventory') ? 'active' : ''
                }
                onClick={() => onNavigate(target)}
              >
                <Icon size={18} />
                <span>
                  {labels[target]}
                  <small>{caption}</small>
                </span>
                <ChevronRight size={14} />
              </button>
            ))}
          </nav>
        </div>
        <div className="admin-sidebar-bottom">
          <div className="admin-help">
            <ShieldCheck size={17} />
            <span>Protected by admin access rules</span>
          </div>
          {preview ? (
            <button
              onClick={() => {
                void onExit();
              }}
            >
              Back to sign in <LogOut size={16} />
            </button>
          ) : (
            <button onClick={() => void onExit()}>
              Sign out <LogOut size={16} />
            </button>
          )}
        </div>
      </aside>
      <main className="admin-main">
        <header className="admin-topbar">
          <div>
            <span>THE SUNDAY EDIT</span>
            <ChevronRight size={14} />
            <strong>{labels[page]}</strong>
          </div>
          <div>
            <span className={`admin-live-dot ${preview ? 'is-preview' : ''}`} />
            {preview ? 'Preview mode' : 'Admin signed in'}
            <a href="/" target="_blank" rel="noreferrer">
              View shop <ArrowUpRight size={15} />
            </a>
          </div>
        </header>
        <div className="admin-content">
          {preview && (
            <div className="admin-preview-banner">
              <EyeOff size={17} />
              <span>
                Read-only preview. Sign in with an approved admin account to publish changes.
              </span>
            </div>
          )}
          {notice && (
            <p className="admin-success" role="status">
              <CheckCircle2 size={18} />
              {notice}
            </p>
          )}
          {error && (
            <p className="admin-error" role="alert">
              <AlertCircle size={18} />
              {error}
            </p>
          )}
          {children}
        </div>
      </main>
    </div>
  );
}
