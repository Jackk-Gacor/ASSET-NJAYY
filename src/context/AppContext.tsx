import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import {
  auth,
  db,
  googleProvider,
  handleFirestoreError,
  OperationType,
} from '../firebase';
import {
  UserProfile,
  UserRole,
  DataCoreItem,
  FeederItem,
  UplinkItem,
  SidItem,
  FieldReportItem,
  ActivityLog,
  MapFilterTarget,
  E2EStatusReport,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_DATA_CORE,
  INITIAL_FEEDERS,
  INITIAL_UPLINKS,
  INITIAL_SIDS,
  INITIAL_FIELD_REPORTS,
  INITIAL_ACTIVITY_LOGS,
} from '../data/initialData';

interface Toast {
  id: string;
  text: string;
  type: 'success' | 'info' | 'warning';
}

interface AppContextType {
  isLoggedIn: boolean;
  canSwitchRole: boolean;
  firebaseUser: User | null;
  isAuthReady: boolean;
  currentUser: UserProfile;
  currentView: string;
  isLoginModalOpen: boolean;
  isDetailModalOpen: boolean;
  selectedCore: DataCoreItem | null;
  toast: Toast | null;
  searchFilterQuery: string;
  mapFilterTarget: MapFilterTarget | null;
  selectedMapNodeId: string | null;
  drawingSearchPrefill: string;
  
  // Data State
  dataCoreList: DataCoreItem[];
  feederList: FeederItem[];
  uplinkList: UplinkItem[];
  sidList: SidItem[];
  fieldReportList: FieldReportItem[];
  activityLogs: ActivityLog[];

  // Actions
  login: (role?: UserRole) => void;
  loginWithCredentials: (
    identifier: string,
    password: string,
    requestedRole?: UserRole
  ) => Promise<{ ok: boolean; error?: string }>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  setCurrentView: (view: string) => void;
  setIsLoginModalOpen: (open: boolean) => void;
  openCoreDetail: (core: DataCoreItem) => void;
  closeCoreDetail: () => void;
  setSearchFilterQuery: (query: string) => void;
  setMapFilterTarget: (target: MapFilterTarget | null) => void;
  navigateToSearchWithFilter: (target: MapFilterTarget) => void;
  clearMapFilter: () => void;
  navigateToMapNode: (nodeId: string) => void;
  clearSelectedMapNode: () => void;
  navigateToDrawingItem: (tab: 'feeder' | 'uplink', query: string) => void;
  clearDrawingSearchPrefill: () => void;
  showToast: (text: string, type?: 'success' | 'info' | 'warning') => void;

  // Mutators
  addDataCore: (item: Omit<DataCoreItem, 'id' | 'lastUpdate'>) => void;
  updateDataCore: (id: string, updates: Partial<DataCoreItem>) => void;
  deleteDataCore: (id: string) => void;
  approveDataCore: (id: string) => void;
  addFeeder: (item: Omit<FeederItem, 'id'>) => void;
  updateFeeder: (id: string, updates: Partial<FeederItem>) => void;
  updateFeederStatus: (id: string, statusReport: E2EStatusReport) => void;
  addUplink: (item: Omit<UplinkItem, 'id'>) => void;
  updateUplink: (id: string, updates: Partial<UplinkItem>) => void;
  updateUplinkStatus: (id: string, statusReport: E2EStatusReport) => void;
  addSid: (item: Omit<SidItem, 'id'>) => void;
  addFieldReport: (item: Omit<FieldReportItem, 'id'>) => void;
  resetAllDataToDefault: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  LOGGED_IN: 'pln_icon_asset_logged_in',
  CURRENT_USER_ROLE: 'pln_icon_asset_user_role',
  CURRENT_USER_EMAIL: 'pln_icon_asset_user_email',
  CAN_SWITCH_ROLE: 'pln_icon_asset_can_switch_role',
  DATA_CORE: 'pln_icon_asset_data_core_v1',
  FEEDER: 'pln_icon_asset_feeder_v2',
  UPLINK: 'pln_icon_asset_uplink_v2',
  SID: 'pln_icon_asset_sid_v1',
  FIELD_REPORT: 'pln_icon_asset_field_v1',
  LOGS: 'pln_icon_asset_logs_v1',
};

interface InternalAccountConfig {
  identifier: string;
  password: string;
  role: UserRole;
  name: string;
  email: string;
  canSwitchRole: boolean;
}

const INTERNAL_ACCOUNTS: InternalAccountConfig[] = [
  {
    identifier: 'admin123',
    password: '12345678',
    role: 'Admin',
    name: 'Administrator Asset',
    email: 'admin123@iconplus.co.id',
    canSwitchRole: true,
  },
  {
    identifier: 'adamahmad09@gmail.com',
    password: 'adam123',
    role: 'Engineering',
    name: 'Adam Ahmad (Drawing Data)',
    email: 'adamahmad09@gmail.com',
    canSwitchRole: false,
  },
  {
    identifier: 'timdata@iconplus.co.id',
    password: 'data123',
    role: 'Tim Data',
    name: 'Tim Data Asset',
    email: 'timdata@iconplus.co.id',
    canSwitchRole: false,
  },
  {
    identifier: 'field@iconplus.co.id',
    password: 'field123',
    role: 'Field',
    name: 'Petugas Lapangan (Field)',
    email: 'field@iconplus.co.id',
    canSwitchRole: false,
  },
  {
    identifier: 'supervisor@iconplus.co.id',
    password: 'spv123',
    role: 'Supervisor',
    name: 'Supervisor Asset',
    email: 'supervisor@iconplus.co.id',
    canSwitchRole: false,
  },
  {
    identifier: 'viewer@iconplus.co.id',
    password: 'viewer123',
    role: 'Viewer',
    name: 'Viewer Audit',
    email: 'viewer@iconplus.co.id',
    canSwitchRole: false,
  },
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEYS.LOGGED_IN) === 'true';
  });

  const [canSwitchRole, setCanSwitchRole] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEYS.CAN_SWITCH_ROLE) === 'true';
  });

  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const savedEmail = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_EMAIL);
    const savedRole = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ROLE) as UserRole | null;
    if (savedEmail) {
      const matchedAcc = INTERNAL_ACCOUNTS.find(a => a.email === savedEmail);
      if (matchedAcc) {
        const baseUser = INITIAL_USERS.find(u => u.role === matchedAcc.role) || INITIAL_USERS[0];
        return {
          ...baseUser,
          name: matchedAcc.name,
          email: matchedAcc.email,
          role: matchedAcc.role,
        };
      }
    }
    const found = INITIAL_USERS.find(u => u.role === savedRole);
    return found || INITIAL_USERS[0];
  });

  const [currentView, setCurrentView] = useState<string>(() => {
    const isLogged = localStorage.getItem(STORAGE_KEYS.LOGGED_IN) === 'true';
    return isLogged ? 'dashboard' : 'home';
  });

  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedCore, setSelectedCore] = useState<DataCoreItem | null>(null);
  const [searchFilterQuery, setSearchFilterQuery] = useState('');
  const [mapFilterTarget, setMapFilterTarget] = useState<MapFilterTarget | null>(null);
  const [selectedMapNodeId, setSelectedMapNodeId] = useState<string | null>(null);
  const [drawingSearchPrefill, setDrawingSearchPrefill] = useState('');
  const [toast, setToast] = useState<Toast | null>(null);

  // Data loaded from localStorage or initial dummy
  const [dataCoreList, setDataCoreList] = useState<DataCoreItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DATA_CORE);
    return saved ? JSON.parse(saved) : INITIAL_DATA_CORE;
  });

  const [feederList, setFeederList] = useState<FeederItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FEEDER);
    return saved ? JSON.parse(saved) : INITIAL_FEEDERS;
  });

  const [uplinkList, setUplinkList] = useState<UplinkItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.UPLINK);
    return saved ? JSON.parse(saved) : INITIAL_UPLINKS;
  });

  const [sidList, setSidList] = useState<SidItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SID);
    return saved ? JSON.parse(saved) : INITIAL_SIDS;
  });

  const [fieldReportList, setFieldReportList] = useState<FieldReportItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FIELD_REPORT);
    return saved ? JSON.parse(saved) : INITIAL_FIELD_REPORTS;
  });

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LOGS);
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITY_LOGS;
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DATA_CORE, JSON.stringify(dataCoreList));
  }, [dataCoreList]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FEEDER, JSON.stringify(feederList));
  }, [feederList]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.UPLINK, JSON.stringify(uplinkList));
  }, [uplinkList]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SID, JSON.stringify(sidList));
  }, [sidList]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FIELD_REPORT, JSON.stringify(fieldReportList));
  }, [fieldReportList]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(activityLogs));
  }, [activityLogs]);

  // Firebase Auth state listener & user profile sync
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async user => {
      setFirebaseUser(user);
      setIsAuthReady(true);

      if (user) {
        setIsLoggedIn(true);
        localStorage.setItem(STORAGE_KEYS.LOGGED_IN, 'true');

        const isAdminEmail = user.email?.toLowerCase() === 'adamahmad091105@gmail.com';
        const matchedInternal = user.email
          ? INTERNAL_ACCOUNTS.find(acc => acc.email.toLowerCase() === user.email!.toLowerCase())
          : undefined;
        const isLockedDrawingEmail = user.email?.toLowerCase() === 'adamahmdb09@gmail.com';
        const userDocPath = `users/${user.uid}`;
        const savedRole = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ROLE) as UserRole | null;
        let resolvedRole: UserRole = isAdminEmail
          ? 'Admin'
          : matchedInternal
            ? matchedInternal.role
            : isLockedDrawingEmail
              ? 'Engineering'
              : savedRole && savedRole !== 'Admin'
                ? savedRole
                : 'Viewer';

        if (matchedInternal) {
          setCanSwitchRole(matchedInternal.canSwitchRole);
          localStorage.setItem(STORAGE_KEYS.CAN_SWITCH_ROLE, matchedInternal.canSwitchRole ? 'true' : 'false');
        } else if (isAdminEmail) {
          setCanSwitchRole(true);
          localStorage.setItem(STORAGE_KEYS.CAN_SWITCH_ROLE, 'true');
        } else {
          setCanSwitchRole(false);
          localStorage.setItem(STORAGE_KEYS.CAN_SWITCH_ROLE, 'false');
        }

        if (user.emailVerified) {
          try {
            const userRef = doc(db, 'users', user.uid);
            const snap = await getDoc(userRef);
            if (!snap.exists()) {
              await setDoc(userRef, {
                uid: user.uid,
                displayName: (user.displayName || matchedInternal?.name || 'Tim Asset').slice(0, 120),
                role: resolvedRole,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
              });
            } else {
              const data = snap.data();
              if (data?.role && !isAdminEmail && !matchedInternal) {
                resolvedRole = data.role as UserRole;
              }
            }
          } catch (error) {
            handleFirestoreError(error, OperationType.GET, userDocPath);
          }
        }

        setCurrentUser(prev => ({
          ...prev,
          id: user.uid,
          name: matchedInternal?.name || user.displayName || prev.name,
          email: user.email || prev.email,
          role: resolvedRole,
          avatar: user.photoURL || prev.avatar,
        }));
      }
    });

    return () => unsubscribe();
  }, []);

  // Firestore real-time listeners when authenticated with verified email
  useEffect(() => {
    if (!isAuthReady || !firebaseUser || !firebaseUser.emailVerified) return;

    const isAdminUser = firebaseUser.email === 'adamahmad091105@gmail.com';

    const feedersQuery = isAdminUser
      ? query(collection(db, 'feeders'))
      : query(collection(db, 'feeders'), where('ownerId', '==', firebaseUser.uid));

    const unsubFeeders = onSnapshot(
      feedersQuery,
      snapshot => {
        if (snapshot.empty) return;
        const remoteFeeders: FeederItem[] = snapshot.docs.map(d => {
          const data = d.data();
          return {
            id: d.id,
            feederCode: data.feederCode || d.id,
            hostnameOlt: data.hostnameOlt || '',
            statusReport: data.statusReport === 'PROGRESS' ? 'PROGRESS' : 'DONE',
            actualDone: data.actualDone || '',
            reportDone: data.reportDone || '',
            pic: data.pic || '',
            datacoreVisio: data.datacoreVisio || '',
            datacoreVisioUrl: data.datacoreVisioUrl || '',
            mymaps: data.mymaps || '',
            mymapsUrl: data.mymapsUrl || '',
            keterangan: data.keterangan || '',
          };
        });
        setFeederList(prev => {
          const remoteMap = new Map(remoteFeeders.map(f => [f.id, f]));
          const merged = prev.map(item => remoteMap.get(item.id) || item);
          const extra = remoteFeeders.filter(rf => !prev.some(p => p.id === rf.id));
          return [...extra, ...merged];
        });
      },
      error => handleFirestoreError(error, OperationType.LIST, 'feeders')
    );

    const uplinksQuery = isAdminUser
      ? query(collection(db, 'uplinks'))
      : query(collection(db, 'uplinks'), where('ownerId', '==', firebaseUser.uid));

    const unsubUplinks = onSnapshot(
      uplinksQuery,
      snapshot => {
        if (snapshot.empty) return;
        const remoteUplinks: UplinkItem[] = snapshot.docs.map(d => {
          const data = d.data();
          return {
            id: d.id,
            uplinkCode: data.uplinkCode || d.id,
            hostnameOlt: data.hostnameOlt || '',
            statusReport: data.statusReport === 'PROGRESS' ? 'PROGRESS' : 'DONE',
            actualDone: data.actualDone || '',
            reportDone: data.reportDone || '',
            pic: data.pic || '',
            datacoreVisio: data.datacoreVisio || '',
            datacoreVisioUrl: data.datacoreVisioUrl || '',
            mymaps: data.mymaps || '',
            mymapsUrl: data.mymapsUrl || '',
            schematicE2E: data.schematicE2E || '',
            schematicE2EUrl: data.schematicE2EUrl || '',
            keterangan: data.keterangan || '',
          };
        });
        setUplinkList(prev => {
          const remoteMap = new Map(remoteUplinks.map(u => [u.id, u]));
          const merged = prev.map(item => remoteMap.get(item.id) || item);
          const extra = remoteUplinks.filter(ru => !prev.some(p => p.id === ru.id));
          return [...extra, ...merged];
        });
      },
      error => handleFirestoreError(error, OperationType.LIST, 'uplinks')
    );

    const sidsQuery = isAdminUser
      ? query(collection(db, 'sids'))
      : query(collection(db, 'sids'), where('ownerId', '==', firebaseUser.uid));

    const unsubSids = onSnapshot(
      sidsQuery,
      snapshot => {
        if (snapshot.empty) return;
        const remoteSids: SidItem[] = snapshot.docs.map(d => {
          const data = d.data();
          return {
            id: d.id,
            sidNumber: data.sidNumber || d.id,
            customerName: data.customerName || '',
            serviceType: data.serviceType || 'IP-VPN',
            relatedFeederId: data.relatedFeederId || '',
            relatedUplinkId: data.relatedUplinkId || '',
            status: data.status || 'Active',
            bandwidthMbps: typeof data.bandwidthMbps === 'number' ? data.bandwidthMbps : 0,
            pic: data.pic || '',
          };
        });
        setSidList(prev => {
          const remoteMap = new Map(remoteSids.map(s => [s.id, s]));
          const merged = prev.map(item => remoteMap.get(item.id) || item);
          const extra = remoteSids.filter(rs => !prev.some(p => p.id === rs.id));
          return [...extra, ...merged];
        });
      },
      error => handleFirestoreError(error, OperationType.LIST, 'sids')
    );

    return () => {
      unsubFeeders();
      unsubUplinks();
      unsubSids();
    };
  }, [isAuthReady, firebaseUser]);

  const showToast = (text: string, type: 'success' | 'info' | 'warning' = 'info') => {
    const newToast = { id: Math.random().toString(), text, type };
    setToast(newToast);
    setTimeout(() => {
      setToast(current => (current?.id === newToast.id ? null : current));
    }, 3500);
  };

  const login = (role: UserRole = 'Admin') => {
    const user = INITIAL_USERS.find(u => u.role === role) || INITIAL_USERS[0];
    setCurrentUser(user);
    setCanSwitchRole(role === 'Admin');
    setIsLoggedIn(true);
    setIsLoginModalOpen(false);
    setCurrentView('dashboard');
    localStorage.setItem(STORAGE_KEYS.LOGGED_IN, 'true');
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ROLE, user.role);
    localStorage.setItem(STORAGE_KEYS.CAN_SWITCH_ROLE, role === 'Admin' ? 'true' : 'false');
    showToast(`Berhasil login sebagai ${user.name} (${user.role})`, 'success');
  };

  const loginWithCredentials = async (
    identifier: string,
    password: string,
    requestedRole?: UserRole
  ): Promise<{ ok: boolean; error?: string }> => {
    const cleanId = identifier.trim().toLowerCase();
    const cleanPw = password;

    if (!cleanId || !cleanPw) {
      return { ok: false, error: 'Username/Email dan kata sandi wajib diisi.' };
    }

    const matchedAccount = INTERNAL_ACCOUNTS.find(
      acc => acc.identifier.toLowerCase() === cleanId || acc.email.toLowerCase() === cleanId
    );

    if (matchedAccount) {
      if (matchedAccount.password !== cleanPw) {
        return { ok: false, error: 'Username/Email atau kata sandi salah.' };
      }

      if (requestedRole && matchedAccount.role !== requestedRole) {
        const roleLabel = matchedAccount.role === 'Engineering' ? 'Drawing Data' : matchedAccount.role;
        const requestedLabel = requestedRole === 'Engineering' ? 'Drawing Data' : requestedRole;
        return {
          ok: false,
          error: `Akun ${matchedAccount.identifier} hanya memiliki akses role ${roleLabel} dan tidak dapat masuk ke role ${requestedLabel}.`,
        };
      }

      if (matchedAccount.email.includes('@')) {
        try {
          await signInWithEmailAndPassword(auth, matchedAccount.email, cleanPw);
        } catch {
          // Fallback to verified internal session if user is not registered in Firebase Console
        }
      }

      const baseProfile = INITIAL_USERS.find(u => u.role === matchedAccount.role) || INITIAL_USERS[0];
      setCurrentUser({
        ...baseProfile,
        name: matchedAccount.name,
        email: matchedAccount.email,
        role: matchedAccount.role,
      });
      setCanSwitchRole(matchedAccount.canSwitchRole);
      setIsLoggedIn(true);
      setIsLoginModalOpen(false);
      setCurrentView(matchedAccount.role === 'Engineering' ? 'engineering-feeder' : 'dashboard');
      localStorage.setItem(STORAGE_KEYS.LOGGED_IN, 'true');
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ROLE, matchedAccount.role);
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_EMAIL, matchedAccount.email);
      localStorage.setItem(STORAGE_KEYS.CAN_SWITCH_ROLE, matchedAccount.canSwitchRole ? 'true' : 'false');

      const roleLabel = matchedAccount.role === 'Engineering' ? 'Drawing Data' : matchedAccount.role;
      showToast(`Berhasil login sebagai ${matchedAccount.name} (${roleLabel})`, 'success');
      return { ok: true };
    }

    // If not in static INTERNAL_ACCOUNTS, authenticate directly with Firebase Email/Password
    if (!cleanId.includes('@')) {
      return { ok: false, error: 'Username/Email atau kata sandi salah.' };
    }

    const isFirebaseAdmin = cleanId === 'adamahmad091105@gmail.com';
    const isLockedDrawing = cleanId === 'adamahmdb09@gmail.com';

    if (isLockedDrawing && requestedRole && requestedRole !== 'Engineering') {
      const requestedLabel = requestedRole;
      return {
        ok: false,
        error: `Akun ${cleanId} hanya memiliki akses role Drawing Data dan tidak dapat masuk ke role ${requestedLabel}.`,
      };
    }

    if (!isFirebaseAdmin && requestedRole === 'Admin') {
      return {
        ok: false,
        error: `Akun ${cleanId} tidak memiliki hak akses Admin. Gunakan admin123 atau adamahmad091105@gmail.com.`,
      };
    }

    try {
      const cred = await signInWithEmailAndPassword(auth, cleanId, cleanPw);
      const resolvedRole: UserRole = isFirebaseAdmin
        ? requestedRole || 'Admin'
        : isLockedDrawing
          ? 'Engineering'
          : requestedRole || 'Engineering';
      const allowSwitch = isFirebaseAdmin;
      const baseProfile = INITIAL_USERS.find(u => u.role === resolvedRole) || INITIAL_USERS[0];
      const displayName = cred.user.displayName || cleanId.split('@')[0];

      setCurrentUser({
        ...baseProfile,
        id: cred.user.uid,
        name: displayName,
        email: cred.user.email || cleanId,
        role: resolvedRole,
      });
      setCanSwitchRole(allowSwitch);
      setIsLoggedIn(true);
      setIsLoginModalOpen(false);
      setCurrentView(resolvedRole === 'Engineering' ? 'engineering-feeder' : 'dashboard');
      localStorage.setItem(STORAGE_KEYS.LOGGED_IN, 'true');
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ROLE, resolvedRole);
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_EMAIL, cred.user.email || cleanId);
      localStorage.setItem(STORAGE_KEYS.CAN_SWITCH_ROLE, allowSwitch ? 'true' : 'false');

      const roleLabel = resolvedRole === 'Engineering' ? 'Drawing Data' : resolvedRole;
      showToast(`Berhasil login Firebase sebagai ${displayName} (${roleLabel})`, 'success');
      return { ok: true };
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code || '';
      if (
        code === 'auth/invalid-credential' ||
        code === 'auth/wrong-password' ||
        code === 'auth/user-not-found' ||
        code === 'auth/invalid-email'
      ) {
        return { ok: false, error: 'Email atau kata sandi Firebase tidak cocok.' };
      }
      if (code === 'auth/too-many-requests') {
        return { ok: false, error: 'Terlalu banyak percobaan login. Silakan coba lagi nanti.' };
      }
      return { ok: false, error: 'Gagal autentikasi dengan Firebase. Periksa email & kata sandi Anda.' };
    }
  };

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const isAdminEmail = result.user.email === 'adamahmad091105@gmail.com';
      setCanSwitchRole(isAdminEmail);
      setIsLoggedIn(true);
      setIsLoginModalOpen(false);
      setCurrentView('dashboard');
      localStorage.setItem(STORAGE_KEYS.LOGGED_IN, 'true');
      localStorage.setItem(STORAGE_KEYS.CAN_SWITCH_ROLE, isAdminEmail ? 'true' : 'false');
      showToast(`Login Google berhasil: ${result.user.displayName || result.user.email}`, 'success');
    } catch (error) {
      console.error('Google sign-in error:', error);
      showToast('Gagal masuk dengan akun Google. Silakan coba lagi.', 'warning');
    }
  };

  const logout = () => {
    if (auth.currentUser) {
      signOut(auth).catch(err => console.error('Sign out error:', err));
    }
    setIsLoggedIn(false);
    setCanSwitchRole(false);
    setCurrentView('home');
    localStorage.removeItem(STORAGE_KEYS.LOGGED_IN);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ROLE);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_EMAIL);
    localStorage.removeItem(STORAGE_KEYS.CAN_SWITCH_ROLE);
    showToast('Telah keluar dari sistem internal Divisi Asset', 'info');
  };

  const switchRole = (role: UserRole) => {
    if (!canSwitchRole) {
      showToast('Akun Anda tidak memiliki izin untuk berpindah role.', 'warning');
      return;
    }
    const user = INITIAL_USERS.find(u => u.role === role) || INITIAL_USERS[0];
    setCurrentUser(user);
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ROLE, user.role);
    showToast(`Beralih simulasi role: ${user.role} (${user.name})`, 'info');
  };

  const openCoreDetail = (core: DataCoreItem) => {
    setSelectedCore(core);
    setIsDetailModalOpen(true);
  };

  const closeCoreDetail = () => {
    setIsDetailModalOpen(false);
    setSelectedCore(null);
  };

  const navigateToSearchWithFilter = (target: MapFilterTarget) => {
    setMapFilterTarget(target);
    setCurrentView('search');
    showToast(
      `Pencarian difilter berdasarkan ${target.type === 'node' ? 'Simpul' : 'Segmen'}: ${target.code}`,
      'info'
    );
  };

  const clearMapFilter = () => {
    setMapFilterTarget(null);
    showToast('Filter simpul/segmen dari peta telah dibersihkan', 'info');
  };

  const navigateToMapNode = (nodeId: string) => {
    setSelectedMapNodeId(nodeId);
    setCurrentView('network-map');
  };

  const clearSelectedMapNode = () => {
    setSelectedMapNodeId(null);
  };

  const navigateToDrawingItem = (tab: 'feeder' | 'uplink', query: string) => {
    setDrawingSearchPrefill(query);
    setCurrentView(tab === 'uplink' ? 'engineering-uplink' : 'engineering-feeder');
  };

  const clearDrawingSearchPrefill = () => {
    setDrawingSearchPrefill('');
  };

  const addDataCore = (item: Omit<DataCoreItem, 'id' | 'lastUpdate'>) => {
    const newId = `CORE-MLG-${String(dataCoreList.length + 1).padStart(3, '0')}`;
    const today = new Date().toISOString().split('T')[0];
    const newCore: DataCoreItem = {
      ...item,
      id: newId,
      lastUpdate: today,
    };
    setDataCoreList(prev => [newCore, ...prev]);

    const newLog: ActivityLog = {
      id: `ACT-${Date.now()}`,
      timestamp: `${today} ${new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB`,
      user: currentUser.name,
      action: `Menambahkan Data Core baru ${newCore.hostname}`,
      entity: newCore.id,
      type: 'create',
    };
    setActivityLogs(prev => [newLog, ...prev]);
    showToast(`Data Core ${newCore.hostname} berhasil ditambahkan`, 'success');
  };

  const updateDataCore = (id: string, updates: Partial<DataCoreItem>) => {
    const today = new Date().toISOString().split('T')[0];
    setDataCoreList(prev =>
      prev.map(c => (c.id === id ? { ...c, ...updates, lastUpdate: today } : c))
    );

    const newLog: ActivityLog = {
      id: `ACT-${Date.now()}`,
      timestamp: `${today} ${new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB`,
      user: currentUser.name,
      action: `Memperbarui Data Core`,
      entity: id,
      type: 'update',
    };
    setActivityLogs(prev => [newLog, ...prev]);
    showToast(`Data Core ${id} berhasil diperbarui`, 'success');
  };

  const deleteDataCore = (id: string) => {
    setDataCoreList(prev => prev.filter(c => c.id !== id));
    showToast(`Data Core ${id} telah dihapus`, 'info');
  };

  const approveDataCore = (id: string) => {
    updateDataCore(id, { status: 'Approved' });
    showToast(`Status data ${id} berhasil di-Approved/WIG verified`, 'success');
  };

  const addFeeder = (item: Omit<FeederItem, 'id'>) => {
    const newId = `FDR-${Date.now()}`;
    const newFeeder: FeederItem = {
      ...item,
      id: newId,
    };
    setFeederList(prev => [newFeeder, ...prev]);

    if (firebaseUser && firebaseUser.emailVerified) {
      const path = `feeders/${newId}`;
      setDoc(doc(db, 'feeders', newId), {
        feederCode: newFeeder.feederCode.slice(0, 64),
        hostnameOlt: newFeeder.hostnameOlt.slice(0, 160),
        statusReport: newFeeder.statusReport,
        actualDone: (newFeeder.actualDone || '').slice(0, 32),
        reportDone: (newFeeder.reportDone || '').slice(0, 32),
        pic: newFeeder.pic.slice(0, 64),
        datacoreVisio: (newFeeder.datacoreVisio || '').slice(0, 200),
        datacoreVisioUrl: (newFeeder.datacoreVisioUrl || '').slice(0, 500),
        mymaps: (newFeeder.mymaps || '').slice(0, 200),
        mymapsUrl: (newFeeder.mymapsUrl || '').slice(0, 500),
        keterangan: (newFeeder.keterangan || '').slice(0, 500),
        ownerId: firebaseUser.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }).catch(error => handleFirestoreError(error, OperationType.CREATE, path));
    }

    showToast(`E2E Feeder ${newFeeder.hostnameOlt} berhasil ditambahkan`, 'success');
  };

  const updateFeeder = (id: string, updates: Partial<FeederItem>) => {
    const existingItem = feederList.find(f => f.id === id);
    const merged = existingItem ? { ...existingItem, ...updates } : undefined;
    setFeederList(prev =>
      prev.map(item => (item.id === id ? { ...item, ...updates } : item))
    );

    if (firebaseUser && firebaseUser.emailVerified && merged) {
      const safeId = id.replace(/[^a-zA-Z0-9_\-]/g, '-').slice(0, 128);
      const docRef = doc(db, 'feeders', safeId);
      const path = `feeders/${safeId}`;
      getDoc(docRef)
        .then(snap => {
          if (snap.exists()) {
            return updateDoc(docRef, {
              hostnameOlt: merged.hostnameOlt.slice(0, 160),
              statusReport: merged.statusReport,
              actualDone: (merged.actualDone || '').slice(0, 32),
              reportDone: (merged.reportDone || '').slice(0, 32),
              pic: merged.pic.slice(0, 64),
              datacoreVisio: (merged.datacoreVisio || '').slice(0, 200),
              datacoreVisioUrl: (merged.datacoreVisioUrl || '').slice(0, 500),
              mymaps: (merged.mymaps || '').slice(0, 200),
              mymapsUrl: (merged.mymapsUrl || '').slice(0, 500),
              keterangan: (merged.keterangan || '').slice(0, 500),
              updatedAt: serverTimestamp(),
            });
          }
          return setDoc(docRef, {
            feederCode: (merged.feederCode || safeId).slice(0, 64),
            hostnameOlt: merged.hostnameOlt.slice(0, 160),
            statusReport: merged.statusReport,
            actualDone: (merged.actualDone || '').slice(0, 32),
            reportDone: (merged.reportDone || '').slice(0, 32),
            pic: merged.pic.slice(0, 64),
            datacoreVisio: (merged.datacoreVisio || '').slice(0, 200),
            datacoreVisioUrl: (merged.datacoreVisioUrl || '').slice(0, 500),
            mymaps: (merged.mymaps || '').slice(0, 200),
            mymapsUrl: (merged.mymapsUrl || '').slice(0, 500),
            keterangan: (merged.keterangan || '').slice(0, 500),
            ownerId: firebaseUser.uid,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        })
        .catch(error => handleFirestoreError(error, OperationType.UPDATE, path));
    }

    showToast('Data E2E Feeder berhasil diperbarui', 'success');
  };

  const updateFeederStatus = (id: string, statusReport: E2EStatusReport) => {
    const todayFormatted = new Date().toLocaleDateString('en-GB');
    const existingItem = feederList.find(f => f.id === id);
    const nextReportDone = statusReport === 'DONE' ? (existingItem?.reportDone || todayFormatted) : '';

    setFeederList(prev =>
      prev.map(item =>
        item.id === id
          ? {
              ...item,
              statusReport,
              reportDone: nextReportDone,
            }
          : item
      )
    );

    if (firebaseUser && firebaseUser.emailVerified && existingItem) {
      const safeId = id.replace(/[^a-zA-Z0-9_\-]/g, '-').slice(0, 128);
      const docRef = doc(db, 'feeders', safeId);
      const path = `feeders/${safeId}`;
      getDoc(docRef)
        .then(snap => {
          if (snap.exists()) {
            return updateDoc(docRef, {
              statusReport,
              reportDone: nextReportDone.slice(0, 32),
              updatedAt: serverTimestamp(),
            });
          }
          return setDoc(docRef, {
            feederCode: (existingItem.feederCode || safeId).slice(0, 64),
            hostnameOlt: existingItem.hostnameOlt.slice(0, 160),
            statusReport,
            actualDone: (existingItem.actualDone || '').slice(0, 32),
            reportDone: nextReportDone.slice(0, 32),
            pic: existingItem.pic.slice(0, 64),
            datacoreVisio: (existingItem.datacoreVisio || '').slice(0, 200),
            datacoreVisioUrl: (existingItem.datacoreVisioUrl || '').slice(0, 500),
            mymaps: (existingItem.mymaps || '').slice(0, 200),
            mymapsUrl: (existingItem.mymapsUrl || '').slice(0, 500),
            keterangan: (existingItem.keterangan || '').slice(0, 500),
            ownerId: firebaseUser.uid,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        })
        .catch(error => handleFirestoreError(error, OperationType.UPDATE, path));
    }

    showToast(`Status E2E Feeder diperbarui menjadi ${statusReport}`, 'success');
  };

  const addUplink = (item: Omit<UplinkItem, 'id'>) => {
    const newId = `UPL-${Date.now()}`;
    const newUplink: UplinkItem = {
      ...item,
      id: newId,
    };
    setUplinkList(prev => [newUplink, ...prev]);

    if (firebaseUser && firebaseUser.emailVerified) {
      const path = `uplinks/${newId}`;
      setDoc(doc(db, 'uplinks', newId), {
        uplinkCode: newUplink.uplinkCode.slice(0, 64),
        hostnameOlt: newUplink.hostnameOlt.slice(0, 160),
        statusReport: newUplink.statusReport,
        actualDone: (newUplink.actualDone || '').slice(0, 32),
        reportDone: (newUplink.reportDone || '').slice(0, 32),
        pic: newUplink.pic.slice(0, 64),
        datacoreVisio: (newUplink.datacoreVisio || '').slice(0, 200),
        datacoreVisioUrl: (newUplink.datacoreVisioUrl || '').slice(0, 500),
        mymaps: (newUplink.mymaps || '').slice(0, 200),
        mymapsUrl: (newUplink.mymapsUrl || '').slice(0, 500),
        schematicE2E: (newUplink.schematicE2E || '').slice(0, 240),
        schematicE2EUrl: (newUplink.schematicE2EUrl || '').slice(0, 500),
        keterangan: (newUplink.keterangan || '').slice(0, 500),
        ownerId: firebaseUser.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }).catch(error => handleFirestoreError(error, OperationType.CREATE, path));
    }

    showToast(`E2E Uplink ${newUplink.hostnameOlt} berhasil didaftarkan`, 'success');
  };

  const updateUplink = (id: string, updates: Partial<UplinkItem>) => {
    const existingItem = uplinkList.find(u => u.id === id);
    const merged = existingItem ? { ...existingItem, ...updates } : undefined;
    setUplinkList(prev =>
      prev.map(item => (item.id === id ? { ...item, ...updates } : item))
    );

    if (firebaseUser && firebaseUser.emailVerified && merged) {
      const safeId = id.replace(/[^a-zA-Z0-9_\-]/g, '-').slice(0, 128);
      const docRef = doc(db, 'uplinks', safeId);
      const path = `uplinks/${safeId}`;
      getDoc(docRef)
        .then(snap => {
          if (snap.exists()) {
            return updateDoc(docRef, {
              hostnameOlt: merged.hostnameOlt.slice(0, 160),
              statusReport: merged.statusReport,
              actualDone: (merged.actualDone || '').slice(0, 32),
              reportDone: (merged.reportDone || '').slice(0, 32),
              pic: merged.pic.slice(0, 64),
              datacoreVisio: (merged.datacoreVisio || '').slice(0, 200),
              datacoreVisioUrl: (merged.datacoreVisioUrl || '').slice(0, 500),
              mymaps: (merged.mymaps || '').slice(0, 200),
              mymapsUrl: (merged.mymapsUrl || '').slice(0, 500),
              schematicE2E: (merged.schematicE2E || '').slice(0, 240),
              schematicE2EUrl: (merged.schematicE2EUrl || '').slice(0, 500),
              keterangan: (merged.keterangan || '').slice(0, 500),
              updatedAt: serverTimestamp(),
            });
          }
          return setDoc(docRef, {
            uplinkCode: (merged.uplinkCode || safeId).slice(0, 64),
            hostnameOlt: merged.hostnameOlt.slice(0, 160),
            statusReport: merged.statusReport,
            actualDone: (merged.actualDone || '').slice(0, 32),
            reportDone: (merged.reportDone || '').slice(0, 32),
            pic: merged.pic.slice(0, 64),
            datacoreVisio: (merged.datacoreVisio || '').slice(0, 200),
            datacoreVisioUrl: (merged.datacoreVisioUrl || '').slice(0, 500),
            mymaps: (merged.mymaps || '').slice(0, 200),
            mymapsUrl: (merged.mymapsUrl || '').slice(0, 500),
            schematicE2E: (merged.schematicE2E || '').slice(0, 240),
            schematicE2EUrl: (merged.schematicE2EUrl || '').slice(0, 500),
            keterangan: (merged.keterangan || '').slice(0, 500),
            ownerId: firebaseUser.uid,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        })
        .catch(error => handleFirestoreError(error, OperationType.UPDATE, path));
    }

    showToast('Data E2E Uplink berhasil diperbarui', 'success');
  };

  const updateUplinkStatus = (id: string, statusReport: E2EStatusReport) => {
    const todayFormatted = new Date().toLocaleDateString('en-GB');
    const existingItem = uplinkList.find(u => u.id === id);
    const nextReportDone = statusReport === 'DONE' ? (existingItem?.reportDone || todayFormatted) : '';

    setUplinkList(prev =>
      prev.map(item =>
        item.id === id
          ? {
              ...item,
              statusReport,
              reportDone: nextReportDone,
            }
          : item
      )
    );

    if (firebaseUser && firebaseUser.emailVerified && existingItem) {
      const safeId = id.replace(/[^a-zA-Z0-9_\-]/g, '-').slice(0, 128);
      const docRef = doc(db, 'uplinks', safeId);
      const path = `uplinks/${safeId}`;
      getDoc(docRef)
        .then(snap => {
          if (snap.exists()) {
            return updateDoc(docRef, {
              statusReport,
              reportDone: nextReportDone.slice(0, 32),
              updatedAt: serverTimestamp(),
            });
          }
          return setDoc(docRef, {
            uplinkCode: (existingItem.uplinkCode || safeId).slice(0, 64),
            hostnameOlt: existingItem.hostnameOlt.slice(0, 160),
            statusReport,
            actualDone: (existingItem.actualDone || '').slice(0, 32),
            reportDone: nextReportDone.slice(0, 32),
            pic: existingItem.pic.slice(0, 64),
            datacoreVisio: (existingItem.datacoreVisio || '').slice(0, 200),
            datacoreVisioUrl: (existingItem.datacoreVisioUrl || '').slice(0, 500),
            mymaps: (existingItem.mymaps || '').slice(0, 200),
            mymapsUrl: (existingItem.mymapsUrl || '').slice(0, 500),
            schematicE2E: (existingItem.schematicE2E || '').slice(0, 240),
            schematicE2EUrl: (existingItem.schematicE2EUrl || '').slice(0, 500),
            keterangan: (existingItem.keterangan || '').slice(0, 500),
            ownerId: firebaseUser.uid,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        })
        .catch(error => handleFirestoreError(error, OperationType.UPDATE, path));
    }

    showToast(`Status E2E Uplink diperbarui menjadi ${statusReport}`, 'success');
  };

  const addSid = (item: Omit<SidItem, 'id'>) => {
    const newId = `SID-${Date.now()}`;
    const newSid: SidItem = {
      ...item,
      id: newId,
    };
    setSidList(prev => [newSid, ...prev]);

    if (firebaseUser && firebaseUser.emailVerified) {
      const path = `sids/${newId}`;
      setDoc(doc(db, 'sids', newId), {
        sidNumber: newSid.sidNumber.slice(0, 64),
        customerName: newSid.customerName.slice(0, 160),
        serviceType: newSid.serviceType,
        relatedFeederId: (newSid.relatedFeederId || '').slice(0, 64),
        relatedUplinkId: (newSid.relatedUplinkId || '').slice(0, 64),
        status: newSid.status,
        bandwidthMbps: Number(newSid.bandwidthMbps) || 0,
        pic: newSid.pic.slice(0, 64),
        ownerId: firebaseUser.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }).catch(error => handleFirestoreError(error, OperationType.CREATE, path));
    }

    showToast(`SID ${newSid.sidNumber} berhasil direlasikan`, 'success');
  };

  const addFieldReport = (item: Omit<FieldReportItem, 'id'>) => {
    const today = new Date().toISOString().split('T')[0];
    const newReport: FieldReportItem = {
      ...item,
      id: `FLD-${today.replace(/-/g, '')}-${String(fieldReportList.length + 1).padStart(3, '0')}`,
    };
    setFieldReportList(prev => [newReport, ...prev]);

    const newLog: ActivityLog = {
      id: `ACT-${Date.now()}`,
      timestamp: `${today} ${new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB`,
      user: currentUser.name,
      action: `Mengirimkan Laporan Lapangan ${newReport.jenisPekerjaan}`,
      entity: newReport.id,
      type: 'field',
    };
    setActivityLogs(prev => [newLog, ...prev]);
    showToast(`Laporan Lapangan berhasil disimpan & disinkronisasi`, 'success');
  };

  const resetAllDataToDefault = () => {
    setDataCoreList(INITIAL_DATA_CORE);
    setFeederList(INITIAL_FEEDERS);
    setUplinkList(INITIAL_UPLINKS);
    setSidList(INITIAL_SIDS);
    setFieldReportList(INITIAL_FIELD_REPORTS);
    setActivityLogs(INITIAL_ACTIVITY_LOGS);
    localStorage.removeItem(STORAGE_KEYS.DATA_CORE);
    localStorage.removeItem(STORAGE_KEYS.FEEDER);
    localStorage.removeItem(STORAGE_KEYS.UPLINK);
    localStorage.removeItem(STORAGE_KEYS.SID);
    localStorage.removeItem(STORAGE_KEYS.FIELD_REPORT);
    localStorage.removeItem(STORAGE_KEYS.LOGS);
    showToast('Seluruh data simulasi berhasil direset ke nilai awal', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        isLoggedIn,
        canSwitchRole,
        firebaseUser,
        isAuthReady,
        currentUser,
        currentView,
        isLoginModalOpen,
        isDetailModalOpen,
        selectedCore,
        toast,
        searchFilterQuery,
        mapFilterTarget,
        selectedMapNodeId,
        drawingSearchPrefill,
        dataCoreList,
        feederList,
        uplinkList,
        sidList,
        fieldReportList,
        activityLogs,
        login,
        loginWithCredentials,
        loginWithGoogle,
        logout,
        switchRole,
        setCurrentView,
        setIsLoginModalOpen,
        openCoreDetail,
        closeCoreDetail,
        setSearchFilterQuery,
        setMapFilterTarget,
        navigateToSearchWithFilter,
        clearMapFilter,
        navigateToMapNode,
        clearSelectedMapNode,
        navigateToDrawingItem,
        clearDrawingSearchPrefill,
        showToast,
        addDataCore,
        updateDataCore,
        deleteDataCore,
        approveDataCore,
        addFeeder,
        updateFeeder,
        updateFeederStatus,
        addUplink,
        updateUplink,
        updateUplinkStatus,
        addSid,
        addFieldReport,
        resetAllDataToDefault,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
