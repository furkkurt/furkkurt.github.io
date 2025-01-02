
import React from 'react';
import '../output.css'; // Adjust the path to your CSS file accordingly

class CustomHeader extends React.Component {
	scrollToTop() {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	scrollToServices() {
		// Implement scroll to services logic here
	}

	scrollToBottom() {
		window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
	}

	render() {
		return (
			<header className="flex items-center justify-between bg-transparent h-16">
				<img src="assets/firat.png" className="pl-2 h-16" alt="Logo" />
				<div className="font-custom1 text-blue-500 overflow-hidden mx-16 hidden justify-items-right lg:block [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-200px),transparent_100%)]">
					<p className="animate-infinite-scroll w-screen whitespace-nowrap pl-128 text-xl grid justify-items-end">
						TÜRKİYE'NİN ÖNDE GELEN DOKTORLARININ FAVORİ SORGU SİSTEMİ !!!
					</p>
				</div>
				<div className="justify-around space-x-4 pr-8 whitespace-nowrap text-xl font-bold transition">
					<button onClick={this.scrollToTop} className="text-black font-custom3 hover:text-yellow-500 hover:scale-110 transition">
						Anasayfa
					</button>
					<a href="./about.html" className="text-black font-custom3 hover:text-yellow-500 hover:scale-110 transition">Hakkımızda</a>
					<button onClick={this.scrollToServices} className="text-black font-custom3 hover:text-yellow-500 hover:scale-110 transition">
						Hizmetler
					</button>
					<button onClick={this.scrollToBottom} className="text-black font-custom3 hover:text-yellow-500 hover:scale-110 transition">
						İletişim
					</button>
				</div>
			</header>
		);
	}
}

export default CustomHeader;
