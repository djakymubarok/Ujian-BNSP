import { useEffect, useState, type FormEvent } from 'react';
import {
    LayoutDashboard, ChartColumn, ShoppingCart, BriefcaseBusiness,
    Users, Shield, ShieldCheck, Mail, MessageCircle, CalendarDays,
    Contact, Settings, LogOut, Search, Plus, Bell,
    ChevronLeft, ChevronRight, Eye, Pencil, Trash2, X, Menu
} from 'lucide-react';

import {
    getSiswa,
    createSiswa,
    updateSiswa,
    deleteSiswa
} from './services/api';

import type { Siswa } from './services/api';

const emptyForm = {
    kode_siswa: '',
    nama_siswa: '',
    jenis_kelamin: 'Laki-laki',
    jurusan: '',
    kelas: '',
    tanggal_lahir_siswa: '',
    alamat_siswa: ''
};

type ModalMode = 'add' | 'edit' | 'detail' | null;

function App() {
    const [siswa, setSiswa] = useState<Siswa[]>([]);
    const [form, setForm] = useState(emptyForm);
    const [modal, setModal] = useState<ModalMode>(null);
    const [selected, setSelected] = useState<Siswa | null>(null);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(5);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [mobileMenu, setMobileMenu] = useState(false);

    const loadSiswa = async () => {
        try {
            setLoading(true);
            setError('');
            const data = await getSiswa();
            setSiswa(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Gagal mengambil data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void loadSiswa();
    }, []);

    const filteredSiswa = siswa.filter((item) =>
        `${item.kode_siswa} ${item.nama_siswa} ${item.jurusan} ${item.kelas}`
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    const totalPages = Math.max(1, Math.ceil(filteredSiswa.length / perPage));
    const currentPage = Math.min(page, totalPages);
    const startIndex = (currentPage - 1) * perPage;
    const visibleSiswa = filteredSiswa.slice(startIndex, startIndex + perPage);

    const openAdd = () => {
        setForm(emptyForm);
        setSelected(null);
        setModal('add');
    };

    const openEdit = (item: Siswa) => {
        setForm({
            kode_siswa: item.kode_siswa,
            nama_siswa: item.nama_siswa,
            jenis_kelamin: item.jenis_kelamin,
            jurusan: item.jurusan,
            kelas: item.kelas,
            tanggal_lahir_siswa: item.tanggal_lahir_siswa.slice(0, 10),
            alamat_siswa: item.alamat_siswa
        });
        setSelected(item);
        setModal('edit');
    };

    const openDetail = (item: Siswa) => {
        setSelected(item);
        setModal('detail');
    };

    const closeModal = () => {
        setModal(null);
        setSelected(null);
        setForm(emptyForm);
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            setError('');

            if (modal === 'edit') {
                const { kode_siswa, ...updateData } = form;
                await updateSiswa(kode_siswa, updateData);
            } else {
                await createSiswa(form);
            }

            closeModal();
            await loadSiswa();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Operasi gagal');
        }
    };

    const handleDelete = async (kode_siswa: string) => {
        if (!window.confirm(`Yakin ingin menghapus siswa dengan Kode Siswa ${kode_siswa}?`)) {
            return;
        }

        try {
            setError('');
            await deleteSiswa(kode_siswa);
            await loadSiswa();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Gagal menghapus data');
        }
    };

    const formatDate = (date: string) => {
        if (!date) return '-';
        return new Date(`${date.slice(0, 10)}T00:00:00`).toLocaleDateString(
            'id-ID',
            { day: '2-digit', month: 'short', year: 'numeric' }
        );
    };

    const sidebarGroups = [
        {
            title: 'DASHBOARDS',
            items: [
                { label: 'Overview', icon: LayoutDashboard },
                { label: 'Analytics', icon: ChartColumn },
                { label: 'eCommerce', icon: ShoppingCart },
                { label: 'CRM', icon: BriefcaseBusiness }
            ]
        },
        {
            title: 'MANAGEMENT',
            items: [
                { label: 'Users', icon: Users },
                { label: 'Roles', icon: Shield },
                { label: 'Permissions', icon: ShieldCheck }
            ]
        },
        {
            title: 'APPS',
            items: [
                { label: 'Email', icon: Mail, count: '3' },
                { label: 'Chat', icon: MessageCircle, count: '5' },
                { label: 'Calendar', icon: CalendarDays },
                { label: 'Contacts', icon: Contact }
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-[#f5f7fb] text-slate-800">

            {/* SIDEBAR */}
            <aside className={`fixed inset-y-0 left-0 z-40 flex w-[260px] flex-col border-r border-slate-200 bg-white transition-transform duration-300 lg:translate-x-0 ${mobileMenu ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex h-[72px] items-center gap-3 border-b border-slate-100 px-7">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white">
                        <Users size={21} />
                    </div>
                    <span className="text-2xl font-bold tracking-tight text-slate-900">
                        Student<span className="text-blue-600">Hub</span>
                    </span>
                    <button className="ml-auto lg:hidden" onClick={() => setMobileMenu(false)}>
                        <X size={21} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-4 py-5">
                    {sidebarGroups.map((group) => (
                        <div key={group.title} className="mb-7">
                            <p className="mb-3 px-3 text-xs font-bold tracking-wide text-slate-400">
                                {group.title}
                            </p>

                            <div className="space-y-1">
                                {group.items.map((item) => {
                                    const Icon = item.icon;
                                    const active = item.label === 'Users';

                                    return (
                                        <button
                                            key={item.label}
                                            onClick={() => {
                                                if (item.label === 'Users') {
                                                    setMobileMenu(false);
                                                }
                                            }}
                                            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
                                                active
                                                    ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                                                    : 'text-slate-600 hover:bg-slate-100'
                                            }`}
                                        >
                                            <Icon size={20} />
                                            <span>{item.label}</span>
                                            {'count' in item && (
                                                <span className={`ml-auto rounded-full px-2 py-0.5 text-xs ${active ? 'bg-white/20' : 'bg-rose-100 text-rose-500'}`}>
                                                    {item.count}
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}

                    <div>
                        <p className="mb-3 px-3 text-xs font-bold tracking-wide text-slate-400">
                            SETTINGS
                        </p>
                        <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-100">
                            <Settings size={20} />
                            Settings
                        </button>
                    </div>
                </div>

                <div className="border-t border-slate-100 p-4">
                    <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-100">
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* MOBILE OVERLAY */}
            {mobileMenu && (
                <button
                    aria-label="Tutup menu"
                    onClick={() => setMobileMenu(false)}
                    className="fixed inset-0 z-30 bg-black/30 lg:hidden"
                />
            )}

            {/* MAIN */}
            <div className="min-h-screen lg:ml-[260px]">

                {/* TOP NAVBAR */}
                <header className="sticky top-0 z-20 flex h-[72px] items-center justify-between border-b border-slate-200 bg-white px-5 lg:px-8">
                    <div className="flex items-center gap-5">
                        <button
                            className="text-slate-600 lg:hidden"
                            onClick={() => setMobileMenu(true)}
                        >
                            <Menu size={23} />
                        </button>

                        <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
                            <span className="cursor-pointer text-slate-600">Dashboard</span>
                            <span className="rounded-xl bg-blue-50 px-4 py-2 font-semibold text-blue-600">Users</span>
                            <span className="cursor-pointer text-slate-600">Pages</span>
                            <span className="cursor-pointer text-slate-600">Apps⌄</span>
                            <span className="cursor-pointer text-slate-600">Components⌄</span>
                        </nav>
                    </div>

                    <div className="flex items-center gap-3 lg:gap-5">
                        <div className="hidden w-56 items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 xl:flex">
                            <Search size={18} className="text-slate-400" />
                            <input
                                placeholder="Search..."
                                className="w-full text-sm outline-none"
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setPage(1);
                                }}
                            />
                        </div>

                        <button
                            onClick={openAdd}
                            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                        >
                            <Plus size={18} />
                            <span className="hidden sm:inline">Create</span>
                        </button>

                        <span className="hidden text-xl sm:inline">🇮🇩</span>

                        <button className="relative text-slate-500">
                            <Bell size={21} />
                            <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border-2 border-white bg-red-500" />
                        </button>

                        <div className="hidden items-center gap-3 border-l border-slate-200 pl-4 sm:flex">
                            <div className="text-right">
                                <p className="text-sm font-semibold">Admin Siswa</p>
                                <p className="text-xs text-slate-400">Administrator</p>
                            </div>
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
                                AS
                            </div>
                        </div>
                    </div>
                </header>

                {/* PAGE CONTENT */}
                <main className="p-5 lg:p-8">

                    <div className="mb-7">
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                            Users
                        </h1>
                        <p className="mt-1 text-slate-500">
                            Manage and organize your student data.
                        </p>
                    </div>

                    {error && (
                        <div className="mb-5 flex items-center justify-between rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                            {error}
                            <button onClick={() => setError('')}>
                                <X size={18} />
                            </button>
                        </div>
                    )}

                    {/* TABLE CARD */}
                    <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm lg:p-7">

                        <div className="mb-7 flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">
                                    All Students
                                </h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    List of registered students
                                </p>
                            </div>

                            <div className="flex flex-col gap-3 sm:flex-row">
                                <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 sm:w-[280px]">
                                    <Search size={19} className="shrink-0 text-slate-400" />
                                    <input
                                        value={search}
                                        onChange={(e) => {
                                            setSearch(e.target.value);
                                            setPage(1);
                                        }}
                                        placeholder="Search students..."
                                        className="w-full text-sm outline-none"
                                    />
                                </div>

                                <button
                                    onClick={openAdd}
                                    className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                                >
                                    <Plus size={20} />
                                    Add Student
                                </button>
                            </div>
                        </div>

                        {/* TABLE */}
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[950px] border-collapse text-left">
                                <thead>
                                    <tr className="bg-[#f1f5f9] text-sm text-slate-600">
                                        <th className="rounded-l-xl px-5 py-4 font-semibold">No.</th>
                                        <th className="px-5 py-4 font-semibold">Student</th>
                                        <th className="px-5 py-4 font-semibold">Kode Siswa</th>
                                        <th className="px-5 py-4 font-semibold">Jurusan</th>
                                        <th className="px-5 py-4 font-semibold">Kelas</th>
                                        <th className="px-5 py-4 font-semibold">Tanggal Lahir Siswa</th>
                                        <th className="rounded-r-xl px-5 py-4 text-center font-semibold">Action</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan={7} className="py-12 text-center text-slate-500">
                                                Memuat data siswa...
                                            </td>
                                        </tr>
                                    ) : visibleSiswa.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="py-12 text-center text-slate-500">
                                                Data siswa belum tersedia.
                                            </td>
                                        </tr>
                                    ) : (
                                        visibleSiswa.map((item, index) => (
                                            <tr
                                                key={item.kode_siswa}
                                                className="border-b border-slate-100 transition hover:bg-slate-50"
                                            >
                                                <td className="px-5 py-4 text-sm font-medium text-slate-700">
                                                    {startIndex + index + 1}
                                                </td>

                                                <td className="px-5 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-50 font-bold text-blue-600">
                                                            {item.nama_siswa
                                                                .split(' ')
                                                                .slice(0, 2)
                                                                .map((word) => word[0])
                                                                .join('')
                                                                .toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-slate-800">
                                                                {item.nama_siswa}
                                                            </p>
                                                            <p className="mt-0.5 text-xs text-slate-400">
                                                                {item.jenis_kelamin}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="px-5 py-4 text-sm text-slate-600">
                                                    {item.kode_siswa}
                                                </td>

                                                <td className="px-5 py-4 text-sm text-slate-600">
                                                    {item.jurusan}
                                                </td>

                                                <td className="px-5 py-4 text-sm text-slate-600">
                                                    {item.kelas}
                                                </td>

                                                <td className="px-5 py-4 text-sm text-slate-600">
                                                    {formatDate(item.tanggal_lahir_siswa)}
                                                </td>

                                                <td className="px-5 py-4">
                                                    <div className="flex justify-center gap-2">
                                                        <button
                                                            title="Detail"
                                                            onClick={() => openDetail(item)}
                                                            className="rounded-xl bg-blue-50 p-2.5 text-blue-600 transition hover:bg-blue-100"
                                                        >
                                                            <Eye size={19} />
                                                        </button>

                                                        <button
                                                            title="Edit"
                                                            onClick={() => openEdit(item)}
                                                            className="rounded-xl bg-blue-50 p-2.5 text-blue-600 transition hover:bg-blue-100"
                                                        >
                                                            <Pencil size={19} />
                                                        </button>

                                                        <button
                                                            title="Hapus"
                                                            onClick={() => void handleDelete(item.kode_siswa)}
                                                            className="rounded-xl bg-rose-50 p-2.5 text-rose-600 transition hover:bg-rose-100"
                                                        >
                                                            <Trash2 size={19} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* PAGINATION */}
                        <div className="mt-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                            <p className="text-sm text-slate-500">
                                Showing {filteredSiswa.length === 0 ? 0 : startIndex + 1} – {Math.min(startIndex + perPage, filteredSiswa.length)} of {filteredSiswa.length} students
                            </p>

                            <div className="flex flex-wrap items-center gap-2">
                                <select
                                    value={perPage}
                                    onChange={(e) => {
                                        setPerPage(Number(e.target.value));
                                        setPage(1);
                                    }}
                                    className="mr-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none"
                                >
                                    <option value={5}>5 per page</option>
                                    <option value={10}>10 per page</option>
                                    <option value={20}>20 per page</option>
                                </select>

                                <button
                                    disabled={currentPage === 1}
                                    onClick={() => setPage(currentPage - 1)}
                                    className="rounded-lg border border-slate-200 p-2.5 text-slate-600 hover:bg-slate-100 disabled:opacity-40"
                                >
                                    <ChevronLeft size={18} />
                                </button>

                                {Array.from({ length: totalPages }, (_, i) => i + 1)
                                    .slice(Math.max(0, currentPage - 3), currentPage + 2)
                                    .map((number) => (
                                        <button
                                            key={number}
                                            onClick={() => setPage(number)}
                                            className={`h-10 min-w-10 rounded-lg px-3 text-sm font-semibold ${
                                                currentPage === number
                                                    ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                                                    : 'text-slate-600 hover:bg-slate-100'
                                            }`}
                                        >
                                            {number}
                                        </button>
                                    ))}

                                <button
                                    disabled={currentPage === totalPages}
                                    onClick={() => setPage(currentPage + 1)}
                                    className="rounded-lg border border-slate-200 p-2.5 text-slate-600 hover:bg-slate-100 disabled:opacity-40"
                                >
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>
                    </section>
                </main>
            </div>

            {/* MODAL */}
            {modal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/50 p-4">
                    <div className="my-8 w-full max-w-2xl rounded-2xl bg-white shadow-2xl">

                        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">
                                    {modal === 'add' && 'Add New Student'}
                                    {modal === 'edit' && 'Edit Student'}
                                    {modal === 'detail' && 'Student Details'}
                                </h3>
                                <p className="mt-1 text-sm text-slate-500">
                                    {modal === 'detail'
                                        ? 'Student information'
                                        : 'Please complete the student information'}
                                </p>
                            </div>
                            <button
                                onClick={closeModal}
                                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
                            >
                                <X size={21} />
                            </button>
                        </div>

                        {modal === 'detail' && selected ? (
                            <div className="grid gap-5 p-6 sm:grid-cols-2">
                                {[
                                    ['Kode Siswa', selected.kode_siswa],
                                    ['Nama Siswa', selected.nama_siswa],
                                    ['Jenis Kelamin', selected.jenis_kelamin],
                                    ['Jurusan', selected.jurusan],
                                    ['Kelas', selected.kelas],
                                    ['Tanggal Lahir Siswa', formatDate(selected.tanggal_lahir_siswa)],
                                    ['Alamat Siswa', selected.alamat_siswa]
                                ].map(([label, value]) => (
                                    <div key={label}>
                                        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                                            {label}
                                        </p>
                                        <p className="text-sm font-medium text-slate-800">
                                            {value}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4 p-6">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium">Kode Siswa</label>
                                        <input
                                            name="kode_siswa"
                                            value={form.kode_siswa}
                                            onChange={(e) => setForm({ ...form, kode_siswa: e.target.value })}
                                            disabled={modal === 'edit'}
                                            required
                                            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 disabled:bg-slate-100"
                                            placeholder="Masukkan kode siswa"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium">Nama Siswa</label>
                                        <input
                                            value={form.nama_siswa}
                                            onChange={(e) => setForm({ ...form, nama_siswa: e.target.value })}
                                            required
                                            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
                                            placeholder="Nama lengkap"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium">Jenis Kelamin</label>
                                        <select
                                            value={form.jenis_kelamin}
                                            onChange={(e) => setForm({ ...form, jenis_kelamin: e.target.value })}
                                            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
                                        >
                                            <option value="Laki-laki">Laki-laki</option>
                                            <option value="Perempuan">Perempuan</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium">Jurusan</label>
                                        <input
                                            value={form.jurusan}
                                            onChange={(e) => setForm({ ...form, jurusan: e.target.value })}
                                            required
                                            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
                                            placeholder="Masukkan jurusan"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium">Kelas</label>
                                        <input
                                            value={form.kelas}
                                            onChange={(e) => setForm({ ...form, kelas: e.target.value })}
                                            required
                                            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
                                            placeholder="Contoh: XII RPL 1"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium">Tanggal Lahir Siswa</label>
                                        <input
                                            type="date"
                                            value={form.tanggal_lahir_siswa}
                                            onChange={(e) => setForm({ ...form, tanggal_lahir_siswa: e.target.value })}
                                            required
                                            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
                                        />
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label className="mb-1.5 block text-sm font-medium">Alamat Siswa</label>
                                        <textarea
                                            value={form.alamat_siswa}
                                            onChange={(e) => setForm({ ...form, alamat_siswa: e.target.value })}
                                            required
                                            rows={3}
                                            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
                                            placeholder="Masukkan alamat siswa"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                                    >
                                        {modal === 'edit' ? 'Save Changes' : 'Add Student'}
                                    </button>
                                </div>
                            </form>
                        )}

                        {modal === 'detail' && (
                            <div className="flex justify-end border-t border-slate-100 p-5">
                                <button
                                    onClick={closeModal}
                                    className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white"
                                >
                                    Close
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;