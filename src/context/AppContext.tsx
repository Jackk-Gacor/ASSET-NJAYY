import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  UserRole,
  DataCoreItem,
  FeederItem,
  UplinkItem,
  SidItem,
  FieldReportItem,
  ActivityLog,
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
  currentUser: UserProfile;
  currentView: string;
  isLoginModalOpen: boolean;
  isDetailModalOpen: boolean;
  selectedCore: DataCoreItem | null;
  toast: Toast | null;
  searchFilterQuery: string;
  
  // Data State
  dataCoreList: DataCoreItem[];
  feederList: FeederItem[];
  uplinkList: UplinkItem[];
  sidList: SidItem[];
  fieldReportList: FieldReportItem[];
  activityLogs: ActivityLog[];

  // Actions
  login: (role?: UserRole) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  setCurrentView: (view: string) => void;
  setIsLoginModalOpen: (open: boolean) => void;
  openCoreDetail: (core: DataCoreItem) => void;
  closeCoreDetail: () => void;
  setSearchFilterQuery: (query: string) => void;
  showToast: (text: string, type?: 'success' | 'info' | 'warning') => void;

  // Mutators
  addDataCore: (item: Omit<DataCoreItem, 'id' | 'lastUpdate'>) => void;
  updateDataCore: (id: string, updates: Partial<DataCoreItem>) => void;
  deleteDataCore: (id: string) => void;
  approveDataCore: (id: string) => void;
  addFeeder: (item: Omit<FeederItem, 'id' | 'lastAudit'>) => void;
  addUplink: (item: Omit<UplinkItem, 'id'>) => void;
  addSid: (item: Omit<SidItem, 'id'>) => void;
  addFieldReport: (item: Omit<FieldReportItem, 'id'>) => void;
  resetAllDataToDefault: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  LOGGED_IN: 'pln_icon_asset_logged_in',
  CURRENT_USER_ROLE: 'pln_icon_asset_user_role',
  DATA_CORE: 'pln_icon_asset_data_core_v1',
  FEEDER: 'pln_icon_asset_feeder_v1',
  UPLINK: 'pln_icon_asset_uplink_v1',
  SID: 'pln_icon_asset_sid_v1',
  FIELD_REPORT: 'pln_icon_asset_field_v1',
  LOGS: 'pln_icon_asset_logs_v1',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEYS.LOGGED_IN) === 'true';
  });

  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const savedRole = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ROLE) as UserRole | null;
    const found = INITIAL_USERS.find(u => u.role === savedRole);
    return found || INITIAL_USERS[0];
  });

  const [currentView, setCurrentView] = useState<string>(() => {
    const isLogged = localStorage.getItem(STORAGE_KEYS.LOGGED_IN) === 'true';
    return isLogged ? 'dashboard' : 'home';
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedCore, setSelectedCore] = useState<DataCoreItem | null>(null);
  const [searchFilterQuery, setSearchFilterQuery] = useState('');
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
    setIsLoggedIn(true);
    setIsLoginModalOpen(false);
    setCurrentView('dashboard');
    localStorage.setItem(STORAGE_KEYS.LOGGED_IN, 'true');
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ROLE, user.role);
    showToast(`Berhasil login sebagai ${user.name} (${user.role})`, 'success');
  };

  const logout = () => {
    setIsLoggedIn(false);
    setCurrentView('home');
    localStorage.removeItem(STORAGE_KEYS.LOGGED_IN);
    showToast('Telah keluar dari sistem internal Divisi Asset', 'info');
  };

  const switchRole = (role: UserRole) => {
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

  const addFeeder = (item: Omit<FeederItem, 'id' | 'lastAudit'>) => {
    const today = new Date().toISOString().split('T')[0];
    const newFeeder: FeederItem = {
      ...item,
      id: `FDR-${String(feederList.length + 1).padStart(2, '0')}`,
      lastAudit: today,
    };
    setFeederList(prev => [newFeeder, ...prev]);
    showToast(`Feeder ${newFeeder.feederCode} berhasil ditambahkan`, 'success');
  };

  const addUplink = (item: Omit<UplinkItem, 'id'>) => {
    const newUplink: UplinkItem = {
      ...item,
      id: `UPL-${String(uplinkList.length + 1).padStart(2, '0')}`,
    };
    setUplinkList(prev => [newUplink, ...prev]);
    showToast(`Uplink ${newUplink.uplinkCode} berhasil didaftarkan`, 'success');
  };

  const addSid = (item: Omit<SidItem, 'id'>) => {
    const newSid: SidItem = {
      ...item,
      id: `SID-${String(sidList.length + 1).padStart(2, '0')}`,
    };
    setSidList(prev => [newSid, ...prev]);
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
        currentUser,
        currentView,
        isLoginModalOpen,
        isDetailModalOpen,
        selectedCore,
        toast,
        searchFilterQuery,
        dataCoreList,
        feederList,
        uplinkList,
        sidList,
        fieldReportList,
        activityLogs,
        login,
        logout,
        switchRole,
        setCurrentView,
        setIsLoginModalOpen,
        openCoreDetail,
        closeCoreDetail,
        setSearchFilterQuery,
        showToast,
        addDataCore,
        updateDataCore,
        deleteDataCore,
        approveDataCore,
        addFeeder,
        addUplink,
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
