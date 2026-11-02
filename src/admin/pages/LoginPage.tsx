import { useState, type FormEvent } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  ArrowUpRight,
  ChevronRight,
  LockKeyhole,
  ShieldCheck,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Props {
  authStatus: 'loading' | 'guest' | 'authorized';
  busy: boolean;
  error: string;
  onSignIn: (email: string, password: string) => Promise<boolean>;
  onPreview: () => void;
}

export default function LoginPage({ authStatus, busy, error, onSignIn, onPreview }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (await onSignIn(email, password)) setPassword('');
  }
  return (
    <div className="admin-entry">
      <div className="admin-entry-art">
        <a href="/" className="admin-back">
          <ArrowLeft size={16} /> Return to the shop
        </a>
        <div className="admin-entry-copy">
          <span className="admin-kicker">THE SUNDAY EDIT / STUDIO</span>
          <h1>
            Keep your rack
            <br />
            <em>beautifully current.</em>
          </h1>
          <p>
            Publish new looks, set sizes and stock, and keep every hanger ready for your customers.
          </p>
          <div className="admin-entry-rail">
            <img src="/garments/women-1-rack.webp" alt="Sample festive outfit" />
            <img src="/garments/men-1-rack.webp" alt="Sample kurta" />
            <img src="/garments/girls-1-rack.webp" alt="Sample children's outfit" />
          </div>
        </div>
      </div>
      <div className="admin-entry-panel">
        <div className="admin-entry-panel-inner">
          <div className="admin-lock">
            <LockKeyhole size={21} />
          </div>
          <p className="admin-kicker">SHOP MANAGEMENT</p>
          <h2>Welcome back.</h2>
          <p className="admin-muted">Sign in with an approved administrator account.</p>
          {!supabase ? (
            <div className="admin-callout">
              <AlertCircle size={19} />
              <div>
                <strong>Connect the live catalog</strong>
                <p>
                  Set the two public Supabase connection values and apply the included SQL
                  migration. The shop preview remains available while setup is pending.
                </p>
              </div>
            </div>
          ) : (
            <form className="admin-login" onSubmit={submit}>
              <label>
                Email address
                <input
                  type="email"
                  autoComplete="username"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="owner@yourshop.com"
                />
              </label>
              <label>
                Password
                <input
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Your password"
                />
              </label>
              <button className="admin-primary" disabled={busy || authStatus === 'loading'}>
                {busy || authStatus === 'loading' ? 'Checking access…' : 'Sign in to studio'}{' '}
                <ArrowUpRight size={17} />
              </button>
            </form>
          )}
          {error && (
            <p className="admin-error" role="alert">
              <AlertCircle size={17} />
              {error}
            </p>
          )}
          <button
            className="admin-preview-link"
            onClick={() => {
              onPreview();
            }}
          >
            Explore read-only admin preview <ChevronRight size={17} />
          </button>
          <p className="admin-security">
            <ShieldCheck size={15} /> Access is verified by shop administrator policies.
          </p>
        </div>
      </div>
    </div>
  );
}
