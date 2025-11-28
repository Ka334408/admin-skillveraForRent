"use client"
export default function ProvidersTable() {
  const data = [
    {
      id: 112,
      name: "Lindsey Stroud",
      email: "lindsey.stroud@gmail.com",
      status: "Active",
      num: 5,
      balance: "521 SAR",
      img: "https://i.pravatar.cc/40?img=32",
    },
    {
      id: 121,
      name: "Sarah Brown",
      email: "sarah.brown@gmail.com",
      status: "Pending",
      num: 0,
      balance: "—",
      img: "https://i.pravatar.cc/40?img=10",
    },
    {
      id: 15,
      name: "Lindsey Stroud",
      email: "indsey.stroud@gmail.com",
      status: "Pending",
      num: 0,
      balance: "—",
      img: "https://i.pravatar.cc/40?img=32",
    },
    {
      id: 10,
      name: "Sarah Brown",
      email: "sarah.brown@gmail.com",
      status: "Pending",
      num: 0,
      balance: "—",
      img: "https://i.pravatar.cc/40?img=10",
    },
    {
      id: 222,
      name: "Lindsey Stroud",
      email: "indsey.stroud@gmail.com",
      status: "Active",
      num: 2,
      balance: "300 SAR",
      img: "https://i.pravatar.cc/40?img=12",
    },
  ];

  return (
    <div className="w-full px-6 py-6">
      {/* HEADER */}
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Here is a list of all Our providers
      </h1>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full border-separate border-spacing-y-3">
          <thead>
            <tr className="bg-[#0f7f6b] text-white text-left">
              <th className="py-3 px-4 rounded-l-lg">ID</th>
              <th className="py-3 px-4">Provider Name</th>
              <th className="py-3 px-4">Email Address</th>
              <th className="py-3 px-4">Account Status</th>
              <th className="py-3 px-4">Num of facilities</th>
              <th className="py-3 px-4">Account Balance</th>
              <th className="py-3 px-4 rounded-r-lg">Options</th>
            </tr>
          </thead>

          <tbody>
            {data.map((p) => (
              <tr
                key={p.id}
                className="bg-white shadow-sm rounded-lg"
              >
                <td className="py-3 px-4 font-semibold text-gray-600">{p.id}</td>

                <td className="py-3 px-4 flex items-center gap-3">
                  <img
                    src={p.img}
                    className="w-10 h-10 rounded-full border"
                  />
                  <span className="font-semibold text-gray-800">
                    {p.name}
                  </span>
                </td>

                <td className="py-3 px-4 text-gray-600">{p.email}</td>

                <td className="py-3 px-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      p.status === "Active"
                        ? "bg-green-100 text-green-600"
                        : "bg-orange-100 text-orange-600"
                    }`}
                  >
                    {p.status}
                  </span>
                </td>

                <td className="py-3 px-4 text-center text-gray-600">{p.num}</td>

                <td className="py-3 px-4 text-right font-semibold text-gray-700">
                  {p.balance}
                </td>

                <td className="py-3 px-4 flex items-center gap-3">
                  <button className="p-2 bg-green-100 text-green-600 rounded-md text-sm">
                    ✏️
                  </button>
                  <button className="p-2 bg-red-100 text-red-600 rounded-md text-sm">
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}