import Image from "next/image";

const weightClasses = [
	"Pound-for-pound",
	"Flyweight",
	"Bantamweight",
	"Featherweight",
	"Lightweight",
	"Welterweight",
	"Middleweight",
	"Light Heavyweight",
	"Heavyweight",
];

type Fighter = {
	id?: string;
	name: string;
	weightClass: string;
	ranking?: string;
	pfpRanking?: number | null;
};

// Sadece kendi backend'den veri çek
async function getFighters() {
	const res = await fetch("http://localhost:3000/api/fighters", {
		cache: "no-store",
	});
	return await res.json();
}

export default async function Home() {
	const fighters: Fighter[] = await getFighters();

	// Sikletlere göre gruplama
	const grouped = weightClasses.reduce((acc, wc) => {
		acc[wc] = fighters
			.filter((f) => f.weightClass === wc)
			.sort((a, b) => {
				if (a.ranking === "champion") return -1;
				if (b.ranking === "champion") return 1;
				return Number(a.ranking) - Number(b.ranking);
			});
		return acc;
	}, {} as Record<string, Fighter[]>);

	return (
		<div className="min-h-screen w-full bg-gradient-to-br from-black via-gray-900 to-gray-800 font-sans">
			<header className="flex flex-col items-center justify-center py-12">
				<Image
					src="/UFC_Logo.png"
					alt="UFC Fighters"
					width={160}
					height={160}
					className="mb-6 drop-shadow-xl"
					priority
				/>
				<h1 className="text-5xl font-extrabold text-white tracking-wide mb-2 drop-shadow-lg">
					UFC Fighters
				</h1>
				<div className="h-1 w-32 bg-red-600 rounded-full mb-4"></div>
				<p className="text-lg text-gray-300 font-medium mb-2">
					Explore the official UFC fighter rankings by weight class.
				</p>
			</header>
			<main className="max-w-7xl mx-auto px-4 pb-20">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
					{weightClasses.map((wc) => (
						<section
							key={wc}
							className="bg-gray-950 shadow-2xl border border-gray-800 p-6 flex flex-col items-center"
						>
							{/* Siklet başlığı */}
							<h2 className="text-lg font-extrabold text-red-500 mb-2 uppercase tracking-wide text-center">
								{wc === "Pound-for-pound"
									? "POUND-FOR-POUND TOP RANK"
									: wc.toUpperCase()}
							</h2>
							{/* Şampiyonun adı */}
							{grouped[wc][0] && (
								<h3 className="text-3xl font-extrabold text-white mb-4 text-center">
									{grouped[wc][0].name.toUpperCase()}
								</h3>
							)}
							{/* Şampiyonun resmi */}
							{grouped[wc][0] && (
								<Image
									src={`/champions/${grouped[wc][0].name
										.toLowerCase()
										.replace(/\s+/g, "-")}.avif`}
									alt={grouped[wc][0].name}
									width={220}
									height={220}
									className="rounded-xl mx-auto mb-4"
								/>
							)}
							{/* Diğer dövüşçüler */}
							<ul className="flex flex-col w-full mt-6">
								{grouped[wc].slice(1).map((fighter, idx) => (
									<li
										key={fighter.id}
										className="flex items-center justify-start text-white py-2 px-2 border-b border-gray-800"
									>
										<span className="font-bold text-red-500 mr-2">
											{idx + 1}.
										</span>
										<span>{fighter.name}</span>
									</li>
								))}
							</ul>
						</section>
					))}
				</div>
			</main>
			<footer className="w-full text-center py-8 text-gray-500 text-sm">
				&copy; {new Date().getFullYear()} UFC Fighters Panel. Inspired by{" "}
				<a
					href="https://www.ufc.com/"
					target="_blank"
					rel="noopener noreferrer"
					className="text-red-500 underline"
				>
					UFC.com
				</a>
			</footer>
		</div>
	);
}
