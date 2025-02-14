from bs4 import BeautifulSoup
import json

html = """ <div class="bg-white p-4 rounded-[3px] shadow mb-6 mt-3">
        <h2 class="text-xl font-bold mb-4">AUDI A4 B9 Sedan (8W2, 8WC) (05.2015 - ...) Motor Seçenekleri</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <!--[if BLOCK]><![endif]-->            <div class="col-span-full">
                <h3 class="text-lg font-semibold mb-2">Benzin</h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <!--[if BLOCK]><![endif]-->                    <div :class="{'hidden': 0 >= 8 &amp;&amp; !showAllVehicles}">
                        <a href="https://aloparca.com/oto-yedek-parca/audi/audi-a4/audi-a4-b9-sedan-8w2-8wc-052015/audi-a4-14-tfsi-110-kw-150-ps-082015-112019" wire:navigate="" class="block" title="AUDI A4 B9 Sedan (8W2, 8WC) (05.2015 - ...) 1.4 TFSI (110 kW / 150 PS)  (08.2015 - 11.2019) Yedek Parça">
                            <div class="bg-white p-2 rounded-lg text-center shadow hover:shadow-md transition duration-300">
                                <h3 class="text-sm font-semibold">1.4 TFSI (110 kW / 150 PS)</h3>
                            </div>
                        </a>
                    </div>
                                        <div :class="{'hidden': 1 >= 8 &amp;&amp; !showAllVehicles}">
                        <a href="https://aloparca.com/oto-yedek-parca/audi/audi-a4/audi-a4-b9-sedan-8w2-8wc-052015/audi-a4-20-tfsi-quattro-183-kw-249-ps-112015-112019" wire:navigate="" class="block" title="AUDI A4 B9 Sedan (8W2, 8WC) (05.2015 - ...) 2.0 TFSI quattro (183 kW / 249 PS)  (11.2015 - 11.2019) Yedek Parça">
                            <div class="bg-white p-2 rounded-lg text-center shadow hover:shadow-md transition duration-300">
                                <h3 class="text-sm font-semibold">2.0 TFSI quattro (183 kW / 249 PS)</h3>
                            </div>
                        </a>
                    </div>
                                        <div :class="{'hidden': 2 >= 8 &amp;&amp; !showAllVehicles}">
                        <a href="https://aloparca.com/oto-yedek-parca/audi/audi-a4/audi-a4-b9-sedan-8w2-8wc-052015/audi-a4-20-tfsi-quattro-185-kw-252-ps-052015" wire:navigate="" class="block" title="AUDI A4 B9 Sedan (8W2, 8WC) (05.2015 - ...) 2.0 TFSI quattro (185 kW / 252 PS)  (05.2015 - ...) Yedek Parça">
                            <div class="bg-white p-2 rounded-lg text-center shadow hover:shadow-md transition duration-300">
                                <h3 class="text-sm font-semibold">2.0 TFSI quattro (185 kW / 252 PS)</h3>
                            </div>
                        </a>
                    </div>
                                        <div :class="{'hidden': 3 >= 8 &amp;&amp; !showAllVehicles}">
                        <a href="https://aloparca.com/oto-yedek-parca/audi/audi-a4/audi-a4-b9-sedan-8w2-8wc-052015/audi-a4-s4-quattro-260-kw-354-ps-052016" wire:navigate="" class="block" title="AUDI A4 B9 Sedan (8W2, 8WC) (05.2015 - ...) S4 quattro (260 kW / 354 PS)  (05.2016 - ...) Yedek Parça">
                            <div class="bg-white p-2 rounded-lg text-center shadow hover:shadow-md transition duration-300">
                                <h3 class="text-sm font-semibold">S4 quattro (260 kW / 354 PS)</h3>
                            </div>
                        </a>
                    </div>
                    <!--[if ENDBLOCK]><![endif]-->
                </div>
            </div>
                        <div class="col-span-full">
                <h3 class="text-lg font-semibold mb-2">Dizel</h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <!--[if BLOCK]><![endif]-->                    <div :class="{'hidden': 0 >= 8 &amp;&amp; !showAllVehicles}">
                        <a href="https://aloparca.com/oto-yedek-parca/audi/audi-a4/audi-a4-b9-sedan-8w2-8wc-052015/audi-a4-20-tdi-100-kw-136-ps-052015-112019" wire:navigate="" class="block" title="AUDI A4 B9 Sedan (8W2, 8WC) (05.2015 - ...) 2.0 TDI (100 kW / 136 PS)  (05.2015 - 11.2019) Yedek Parça">
                            <div class="bg-white p-2 rounded-lg text-center shadow hover:shadow-md transition duration-300">
                                <h3 class="text-sm font-semibold">2.0 TDI (100 kW / 136 PS)</h3>
                            </div>
                        </a>
                    </div>
                                        <div :class="{'hidden': 1 >= 8 &amp;&amp; !showAllVehicles}">
                        <a href="https://aloparca.com/oto-yedek-parca/audi/audi-a4/audi-a4-b9-sedan-8w2-8wc-052015/audi-a4-20-tdi-110-kw-150-ps-052015-112019" wire:navigate="" class="block" title="AUDI A4 B9 Sedan (8W2, 8WC) (05.2015 - ...) 2.0 TDI (110 kW / 150 PS)  (05.2015 - 11.2019) Yedek Parça">
                            <div class="bg-white p-2 rounded-lg text-center shadow hover:shadow-md transition duration-300">
                                <h3 class="text-sm font-semibold">2.0 TDI (110 kW / 150 PS)</h3>
                            </div>
                        </a>
                    </div>
                                        <div :class="{'hidden': 2 >= 8 &amp;&amp; !showAllVehicles}">
                        <a href="https://aloparca.com/oto-yedek-parca/audi/audi-a4/audi-a4-b9-sedan-8w2-8wc-052015/audi-a4-20-tdi-140-kw-190-ps-052015" wire:navigate="" class="block" title="AUDI A4 B9 Sedan (8W2, 8WC) (05.2015 - ...) 2.0 TDI (140 kW / 190 PS)  (05.2015 - ...) Yedek Parça">
                            <div class="bg-white p-2 rounded-lg text-center shadow hover:shadow-md transition duration-300">
                                <h3 class="text-sm font-semibold">2.0 TDI (140 kW / 190 PS)</h3>
                            </div>
                        </a>
                    </div>
                                        <div :class="{'hidden': 3 >= 8 &amp;&amp; !showAllVehicles}">
                        <a href="https://aloparca.com/oto-yedek-parca/audi/audi-a4/audi-a4-b9-sedan-8w2-8wc-052015/audi-a4-20-tdi-90-kw-122-ps-052016-112019" wire:navigate="" class="block" title="AUDI A4 B9 Sedan (8W2, 8WC) (05.2015 - ...) 2.0 TDI (90 kW / 122 PS)  (05.2016 - 11.2019) Yedek Parça">
                            <div class="bg-white p-2 rounded-lg text-center shadow hover:shadow-md transition duration-300">
                                <h3 class="text-sm font-semibold">2.0 TDI (90 kW / 122 PS)</h3>
                            </div>
                        </a>
                    </div>
                                        <div :class="{'hidden': 4 >= 8 &amp;&amp; !showAllVehicles}">
                        <a href="https://aloparca.com/oto-yedek-parca/audi/audi-a4/audi-a4-b9-sedan-8w2-8wc-052015/audi-a4-20-tdi-quattro-110-kw-150-ps-092016-112019" wire:navigate="" class="block" title="AUDI A4 B9 Sedan (8W2, 8WC) (05.2015 - ...) 2.0 TDI quattro (110 kW / 150 PS)  (09.2016 - 11.2019) Yedek Parça">
                            <div class="bg-white p-2 rounded-lg text-center shadow hover:shadow-md transition duration-300">
                                <h3 class="text-sm font-semibold">2.0 TDI quattro (110 kW / 150 PS)</h3>
                            </div>
                        </a>
                    </div>
                                        <div :class="{'hidden': 5 >= 8 &amp;&amp; !showAllVehicles}">
                        <a href="https://aloparca.com/oto-yedek-parca/audi/audi-a4/audi-a4-b9-sedan-8w2-8wc-052015/audi-a4-20-tdi-quattro-120-kw-163-ps-092016-112019" wire:navigate="" class="block" title="AUDI A4 B9 Sedan (8W2, 8WC) (05.2015 - ...) 2.0 TDI quattro (120 kW / 163 PS)  (09.2016 - 11.2019) Yedek Parça">
                            <div class="bg-white p-2 rounded-lg text-center shadow hover:shadow-md transition duration-300">
                                <h3 class="text-sm font-semibold">2.0 TDI quattro (120 kW / 163 PS)</h3>
                            </div>
                        </a>
                    </div>
                                        <div :class="{'hidden': 6 >= 8 &amp;&amp; !showAllVehicles}">
                        <a href="https://aloparca.com/oto-yedek-parca/audi/audi-a4/audi-a4-b9-sedan-8w2-8wc-052015/audi-a4-20-tdi-quattro-140-kw-190-ps-092015" wire:navigate="" class="block" title="AUDI A4 B9 Sedan (8W2, 8WC) (05.2015 - ...) 2.0 TDI quattro (140 kW / 190 PS)  (09.2015 - ...) Yedek Parça">
                            <div class="bg-white p-2 rounded-lg text-center shadow hover:shadow-md transition duration-300">
                                <h3 class="text-sm font-semibold">2.0 TDI quattro (140 kW / 190 PS)</h3>
                            </div>
                        </a>
                    </div>
                                        <div :class="{'hidden': 7 >= 8 &amp;&amp; !showAllVehicles}">
                        <a href="https://aloparca.com/oto-yedek-parca/audi/audi-a4/audi-a4-b9-sedan-8w2-8wc-052015/audi-a4-40-tdi-140-kw-190-ps-052015" wire:navigate="" class="block" title="AUDI A4 B9 Sedan (8W2, 8WC) (05.2015 - ...) 40 TDI (140 kW / 190 PS)  (05.2015 - ...) Yedek Parça">
                            <div class="bg-white p-2 rounded-lg text-center shadow hover:shadow-md transition duration-300">
                                <h3 class="text-sm font-semibold">40 TDI (140 kW / 190 PS)</h3>
                            </div>
                        </a>
                    </div>
                                        <div :class="{'hidden': 8 >= 8 &amp;&amp; !showAllVehicles}" class="hidden">
                        <a href="https://aloparca.com/oto-yedek-parca/audi/audi-a4/audi-a4-b9-sedan-8w2-8wc-052015/audi-a4-40-tdi-quattro-140-kw-190-ps-092015" wire:navigate="" class="block" title="AUDI A4 B9 Sedan (8W2, 8WC) (05.2015 - ...) 40 TDI quattro (140 kW / 190 PS)  (09.2015 - ...) Yedek Parça">
                            <div class="bg-white p-2 rounded-lg text-center shadow hover:shadow-md transition duration-300">
                                <h3 class="text-sm font-semibold">40 TDI quattro (140 kW / 190 PS)</h3>
                            </div>
                        </a>
                    </div>
                    <!--[if ENDBLOCK]><![endif]-->
                </div>
            </div>
                        <div class="col-span-full">
                <h3 class="text-lg font-semibold mb-2">Dizel/elektrikli</h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <!--[if BLOCK]><![endif]-->                    <div :class="{'hidden': 0 >= 8 &amp;&amp; !showAllVehicles}">
                        <a href="https://aloparca.com/oto-yedek-parca/audi/audi-a4/audi-a4-b9-sedan-8w2-8wc-052015/40-tdi-mild-hybrid-150-kw-204-ps-092020-aGbUk" wire:navigate="" class="block" title="AUDI A4 B9 Sedan (8W2, 8WC) (05.2015 - ...) 40 TDI Mild Hybrid (150 kW / 204 PS) (09.2020 - ...) Yedek Parça">
                            <div class="bg-white p-2 rounded-lg text-center shadow hover:shadow-md transition duration-300">
                                <h3 class="text-sm font-semibold">40 TDI Mild Hybrid (150 kW / 204 PS)</h3>
                            </div>
                        </a>
                    </div>
                                        <div :class="{'hidden': 1 >= 8 &amp;&amp; !showAllVehicles}">
                        <a href="https://aloparca.com/oto-yedek-parca/audi/audi-a4/audi-a4-b9-sedan-8w2-8wc-052015/40-tdi-mild-hybrid-quattro-150-kw-204-ps-052020-wlBav" wire:navigate="" class="block" title="AUDI A4 B9 Sedan (8W2, 8WC) (05.2015 - ...) 40 TDI Mild Hybrid quattro (150 kW / 204 PS) (05.2020 - ...) Yedek Parça">
                            <div class="bg-white p-2 rounded-lg text-center shadow hover:shadow-md transition duration-300">
                                <h3 class="text-sm font-semibold">40 TDI Mild Hybrid quattro (150 kW / 204 PS)</h3>
                            </div>
                        </a>
                    </div>
                                        <div :class="{'hidden': 2 >= 8 &amp;&amp; !showAllVehicles}">
                        <a href="https://aloparca.com/oto-yedek-parca/audi/audi-a4/audi-a4-b9-sedan-8w2-8wc-052015/s4-tdi-mild-hybrid-quattro-255-kw-347-ps-052019-B8hUs" wire:navigate="" class="block" title="AUDI A4 B9 Sedan (8W2, 8WC) (05.2015 - ...) S4 TDI Mild Hybrid quattro (255 kW / 347 PS) (05.2019 - ...) Yedek Parça">
                            <div class="bg-white p-2 rounded-lg text-center shadow hover:shadow-md transition duration-300">
                                <h3 class="text-sm font-semibold">S4 TDI Mild Hybrid quattro (255 kW / 347 PS)</h3>
                            </div>
                        </a>
                    </div>
                    <!--[if ENDBLOCK]><![endif]-->
                </div>
            </div>
                        <div class="col-span-full">
                <h3 class="text-lg font-semibold mb-2">Benzin/elektrikli</h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <!--[if BLOCK]><![endif]-->                    <div :class="{'hidden': 0 >= 8 &amp;&amp; !showAllVehicles}">
                        <a href="https://aloparca.com/oto-yedek-parca/audi/audi-a4/audi-a4-b9-sedan-8w2-8wc-052015/45-tfsi-mild-hybrid-180-kw-245-ps-072018-112019-8mHRx" wire:navigate="" class="block" title="AUDI A4 B9 Sedan (8W2, 8WC) (05.2015 - ...) 45 TFSI Mild Hybrid (180 kW / 245 PS) (07.2018 - 11.2019) Yedek Parça">
                            <div class="bg-white p-2 rounded-lg text-center shadow hover:shadow-md transition duration-300">
                                <h3 class="text-sm font-semibold">45 TFSI Mild Hybrid (180 kW / 245 PS)</h3>
                            </div>
                        </a>
                    </div>
                                        <div :class="{'hidden': 1 >= 8 &amp;&amp; !showAllVehicles}">
                        <a href="https://aloparca.com/oto-yedek-parca/audi/audi-a4/audi-a4-b9-sedan-8w2-8wc-052015/45-tfsi-mild-hybrid-quattro-180-kw-245-ps-072018-112019-GM48X" wire:navigate="" class="block" title="AUDI A4 B9 Sedan (8W2, 8WC) (05.2015 - ...) 45 TFSI Mild Hybrid quattro (180 kW / 245 PS) (07.2018 - 11.2019) Yedek Parça">
                            <div class="bg-white p-2 rounded-lg text-center shadow hover:shadow-md transition duration-300">
                                <h3 class="text-sm font-semibold">45 TFSI Mild Hybrid quattro (180 kW / 245 PS)</h3>
                            </div>
                        </a>
                    </div>
                                        <div :class="{'hidden': 2 >= 8 &amp;&amp; !showAllVehicles}">
                        <a href="https://aloparca.com/oto-yedek-parca/audi/audi-a4/audi-a4-b9-sedan-8w2-8wc-052015/45-tfsi-mild-hybrid-quattro-183-kw-249-ps-022020-vnMlH" wire:navigate="" class="block" title="AUDI A4 B9 Sedan (8W2, 8WC) (05.2015 - ...) 45 TFSI Mild Hybrid quattro (183 kW / 249 PS) (02.2020 - ...) Yedek Parça">
                            <div class="bg-white p-2 rounded-lg text-center shadow hover:shadow-md transition duration-300">
                                <h3 class="text-sm font-semibold">45 TFSI Mild Hybrid quattro (183 kW / 249 PS)</h3>
                            </div>
                        </a>
                    </div>
                                        <div :class="{'hidden': 3 >= 8 &amp;&amp; !showAllVehicles}">
                        <a href="https://aloparca.com/oto-yedek-parca/audi/audi-a4/audi-a4-b9-sedan-8w2-8wc-052015/45-tfsi-mild-hybrid-quattro-195-kw-265-ps-082020-zvRQy" wire:navigate="" class="block" title="AUDI A4 B9 Sedan (8W2, 8WC) (05.2015 - ...) 45 TFSI Mild Hybrid quattro (195 kW / 265 PS) (08.2020 - ...) Yedek Parça">
                            <div class="bg-white p-2 rounded-lg text-center shadow hover:shadow-md transition duration-300">
                                <h3 class="text-sm font-semibold">45 TFSI Mild Hybrid quattro (195 kW / 265 PS)</h3>
                            </div>
                        </a>
                    </div>
                    <!--[if ENDBLOCK]><![endif]-->
                </div>
            </div>
            <!--[if ENDBLOCK]><![endif]-->
        </div>

        <!--[if BLOCK]><![endif]--><!--[if ENDBLOCK]><![endif]-->
    </div>




    <div class="bg-white p-4 rounded-[3px] shadow mb-6 mt-3">
        <h2 class="text-xl font-bold mb-4">AUDI A4 B9 Avant (8W5, 8WD) (08.2015 - ...) Motor Seçenekleri</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <!--[if BLOCK]><![endif]-->            <div class="col-span-full">
                <h3 class="text-lg font-semibold mb-2">Benzin</h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <!--[if BLOCK]><![endif]-->                    <div :class="{'hidden': 0 >= 8 &amp;&amp; !showAllVehicles}">
                        <a href="https://aloparca.com/oto-yedek-parca/audi/audi-a4/audi-a4-b9-avant-8w5-8wd-082015/audi-a4-14-tfsi-110-kw-150-ps-022016-102019" wire:navigate="" class="block" title="AUDI A4 B9 Avant (8W5, 8WD) (08.2015 - ...) 1.4 TFSI (110 kW / 150 PS)  (02.2016 - 10.2019) Yedek Parça">
                            <div class="bg-white p-2 rounded-lg text-center shadow hover:shadow-md transition duration-300">
                                <h3 class="text-sm font-semibold">1.4 TFSI (110 kW / 150 PS)</h3>
                            </div>
                        </a>
                    </div>
                                        <div :class="{'hidden': 1 >= 8 &amp;&amp; !showAllVehicles}">
                        <a href="https://aloparca.com/oto-yedek-parca/audi/audi-a4/audi-a4-b9-avant-8w5-8wd-082015/audi-a4-20-tfsi-quattro-183-kw-249-ps-112015" wire:navigate="" class="block" title="AUDI A4 B9 Avant (8W5, 8WD) (08.2015 - ...) 2.0 TFSI quattro (183 kW / 249 PS)  (11.2015 - ...) Yedek Parça">
                            <div class="bg-white p-2 rounded-lg text-center shadow hover:shadow-md transition duration-300">
                                <h3 class="text-sm font-semibold">2.0 TFSI quattro (183 kW / 249 PS)</h3>
                            </div>
                        </a>
                    </div>
                                        <div :class="{'hidden': 2 >= 8 &amp;&amp; !showAllVehicles}">
                        <a href="https://aloparca.com/oto-yedek-parca/audi/audi-a4/audi-a4-b9-avant-8w5-8wd-082015/audi-a4-20-tfsi-quattro-185-kw-252-ps-082015-102019" wire:navigate="" class="block" title="AUDI A4 B9 Avant (8W5, 8WD) (08.2015 - ...) 2.0 TFSI quattro (185 kW / 252 PS)  (08.2015 - 10.2019) Yedek Parça">
                            <div class="bg-white p-2 rounded-lg text-center shadow hover:shadow-md transition duration-300">
                                <h3 class="text-sm font-semibold">2.0 TFSI quattro (185 kW / 252 PS)</h3>
                            </div>
                        </a>
                    </div>
                    <!--[if ENDBLOCK]><![endif]-->
                </div>
            </div>
                        <div class="col-span-full">
                <h3 class="text-lg font-semibold mb-2">Dizel</h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <!--[if BLOCK]><![endif]-->                    <div :class="{'hidden': 0 >= 8 &amp;&amp; !showAllVehicles}">
                        <a href="https://aloparca.com/oto-yedek-parca/audi/audi-a4/audi-a4-b9-avant-8w5-8wd-082015/audi-a4-20-tdi-100-kw-136-ps-082015-102019" wire:navigate="" class="block" title="AUDI A4 B9 Avant (8W5, 8WD) (08.2015 - ...) 2.0 TDI (100 kW / 136 PS)  (08.2015 - 10.2019) Yedek Parça">
                            <div class="bg-white p-2 rounded-lg text-center shadow hover:shadow-md transition duration-300">
                                <h3 class="text-sm font-semibold">2.0 TDI (100 kW / 136 PS)</h3>
                            </div>
                        </a>
                    </div>
                                        <div :class="{'hidden': 1 >= 8 &amp;&amp; !showAllVehicles}">
                        <a href="https://aloparca.com/oto-yedek-parca/audi/audi-a4/audi-a4-b9-avant-8w5-8wd-082015/audi-a4-20-tdi-110-kw-150-ps-082015-092018" wire:navigate="" class="block" title="AUDI A4 B9 Avant (8W5, 8WD) (08.2015 - ...) 2.0 TDI (110 kW / 150 PS)  (08.2015 - 09.2018) Yedek Parça">
                            <div class="bg-white p-2 rounded-lg text-center shadow hover:shadow-md transition duration-300">
                                <h3 class="text-sm font-semibold">2.0 TDI (110 kW / 150 PS)</h3>
                            </div>
                        </a>
                    </div>
                                        <div :class="{'hidden': 2 >= 8 &amp;&amp; !showAllVehicles}">
                        <a href="https://aloparca.com/oto-yedek-parca/audi/audi-a4/audi-a4-b9-avant-8w5-8wd-082015/audi-a4-20-tdi-140-kw-190-ps-082015" wire:navigate="" class="block" title="AUDI A4 B9 Avant (8W5, 8WD) (08.2015 - ...) 2.0 TDI (140 kW / 190 PS)  (08.2015 - ...) Yedek Parça">
                            <div class="bg-white p-2 rounded-lg text-center shadow hover:shadow-md transition duration-300">
                                <h3 class="text-sm font-semibold">2.0 TDI (140 kW / 190 PS)</h3>
                            </div>
                        </a>
                    </div>
                                        <div :class="{'hidden': 3 >= 8 &amp;&amp; !showAllVehicles}">
                        <a href="https://aloparca.com/oto-yedek-parca/audi/audi-a4/audi-a4-b9-avant-8w5-8wd-082015/audi-a4-20-tdi-90-kw-122-ps-042016-092018" wire:navigate="" class="block" title="AUDI A4 B9 Avant (8W5, 8WD) (08.2015 - ...) 2.0 TDI (90 kW / 122 PS)  (04.2016 - 09.2018) Yedek Parça">
                            <div class="bg-white p-2 rounded-lg text-center shadow hover:shadow-md transition duration-300">
                                <h3 class="text-sm font-semibold">2.0 TDI (90 kW / 122 PS)</h3>
                            </div>
                        </a>
                    </div>
                                        <div :class="{'hidden': 4 >= 8 &amp;&amp; !showAllVehicles}">
                        <a href="https://aloparca.com/oto-yedek-parca/audi/audi-a4/audi-a4-b9-avant-8w5-8wd-082015/audi-a4-20-tdi-quattro-110-kw-150-ps-092016-102019" wire:navigate="" class="block" title="AUDI A4 B9 Avant (8W5, 8WD) (08.2015 - ...) 2.0 TDI quattro (110 kW / 150 PS)  (09.2016 - 10.2019) Yedek Parça">
                            <div class="bg-white p-2 rounded-lg text-center shadow hover:shadow-md transition duration-300">
                                <h3 class="text-sm font-semibold">2.0 TDI quattro (110 kW / 150 PS)</h3>
                            </div>
                        </a>
                    </div>
                                        <div :class="{'hidden': 5 >= 8 &amp;&amp; !showAllVehicles}">
                        <a href="https://aloparca.com/oto-yedek-parca/audi/audi-a4/audi-a4-b9-avant-8w5-8wd-082015/audi-a4-20-tdi-quattro-120-kw-163-ps-092016-092018" wire:navigate="" class="block" title="AUDI A4 B9 Avant (8W5, 8WD) (08.2015 - ...) 2.0 TDI quattro (120 kW / 163 PS)  (09.2016 - 09.2018) Yedek Parça">
                            <div class="bg-white p-2 rounded-lg text-center shadow hover:shadow-md transition duration-300">
                                <h3 class="text-sm font-semibold">2.0 TDI quattro (120 kW / 163 PS)</h3>
                            </div>
                        </a>
                    </div>
                                        <div :class="{'hidden': 6 >= 8 &amp;&amp; !showAllVehicles}">
                        <a href="https://aloparca.com/oto-yedek-parca/audi/audi-a4/audi-a4-b9-avant-8w5-8wd-082015/audi-a4-20-tdi-quattro-140-kw-190-ps-102015" wire:navigate="" class="block" title="AUDI A4 B9 Avant (8W5, 8WD) (08.2015 - ...) 2.0 TDI quattro (140 kW / 190 PS)  (10.2015 - ...) Yedek Parça">
                            <div class="bg-white p-2 rounded-lg text-center shadow hover:shadow-md transition duration-300">
                                <h3 class="text-sm font-semibold">2.0 TDI quattro (140 kW / 190 PS)</h3>
                            </div>
                        </a>
                    </div>
                                        <div :class="{'hidden': 7 >= 8 &amp;&amp; !showAllVehicles}">
                        <a href="https://aloparca.com/oto-yedek-parca/audi/audi-a4/audi-a4-b9-avant-8w5-8wd-082015/audi-a4-40-tdi-140-kw-190-ps-102018-052019" wire:navigate="" class="block" title="AUDI A4 B9 Avant (8W5, 8WD) (08.2015 - ...) 40 TDI (140 kW / 190 PS)  (10.2018 - 05.2019) Yedek Parça">
                            <div class="bg-white p-2 rounded-lg text-center shadow hover:shadow-md transition duration-300">
                                <h3 class="text-sm font-semibold">40 TDI (140 kW / 190 PS)</h3>
                            </div>
                        </a>
                    </div>
                                        <div :class="{'hidden': 8 >= 8 &amp;&amp; !showAllVehicles}" class="hidden">
                        <a href="https://aloparca.com/oto-yedek-parca/audi/audi-a4/audi-a4-b9-avant-8w5-8wd-082015/audi-a4-40-tdi-quattro-140-kw-190-ps-102018-092020" wire:navigate="" class="block" title="AUDI A4 B9 Avant (8W5, 8WD) (08.2015 - ...) 40 TDI quattro (140 kW / 190 PS)  (10.2018 - 09.2020) Yedek Parça">
                            <div class="bg-white p-2 rounded-lg text-center shadow hover:shadow-md transition duration-300">
                                <h3 class="text-sm font-semibold">40 TDI quattro (140 kW / 190 PS)</h3>
                            </div>
                        </a>
                    </div>
                    <!--[if ENDBLOCK]><![endif]-->
                </div>
            </div>
                        <div class="col-span-full">
                <h3 class="text-lg font-semibold mb-2">Diesel/Elektirikli</h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <!--[if BLOCK]><![endif]-->                    <div :class="{'hidden': 0 >= 8 &amp;&amp; !showAllVehicles}">
                        <a href="https://aloparca.com/oto-yedek-parca/audi/audi-a4/audi-a4-b9-avant-8w5-8wd-082015/audi-a4-40-tdi-mild-hybrid-150-kw-204-ps-092020" wire:navigate="" class="block" title="AUDI A4 B9 Avant (8W5, 8WD) (08.2015 - ...) 40 TDI Mild Hybrid (150 kW / 204 PS)  (09.2020 - ...) Yedek Parça">
                            <div class="bg-white p-2 rounded-lg text-center shadow hover:shadow-md transition duration-300">
                                <h3 class="text-sm font-semibold">40 TDI Mild Hybrid (150 kW / 204 PS)</h3>
                            </div>
                        </a>
                    </div>
                                        <div :class="{'hidden': 1 >= 8 &amp;&amp; !showAllVehicles}">
                        <a href="https://aloparca.com/oto-yedek-parca/audi/audi-a4/audi-a4-b9-avant-8w5-8wd-082015/audi-a4-40-tdi-mild-hybrid-quattro-150-kw-204-ps-052020" wire:navigate="" class="block" title="AUDI A4 B9 Avant (8W5, 8WD) (08.2015 - ...) 40 TDI Mild Hybrid quattro (150 kW / 204 PS)  (05.2020 - ...) Yedek Parça">
                            <div class="bg-white p-2 rounded-lg text-center shadow hover:shadow-md transition duration-300">
                                <h3 class="text-sm font-semibold">40 TDI Mild Hybrid quattro (150 kW / 204 PS)</h3>
                            </div>
                        </a>
                    </div>
                    <!--[if ENDBLOCK]><![endif]-->
                </div>
            </div>
            <!--[if ENDBLOCK]><![endif]-->
        </div>

        <!--[if BLOCK]><![endif]--><!--[if ENDBLOCK]><![endif]-->
    </div>
     """
from bs4 import BeautifulSoup
import json

# Assuming html is the raw HTML content you have.
soup = BeautifulSoup(html, 'html.parser')

# Initialisation des données
data = {"titles": []}

# Recherche de tous les titres h2
main_titles = soup.find_all("h2")

for main_title in main_titles:
    title_text = main_title.text.strip()
    
    # Trouver la section des catégories juste après chaque h2
    parent_div = main_title.find_parent("div", class_="bg-white p-4 rounded-[3px] shadow mb-6 mt-3")
    category_list = []

    if parent_div:
        # Trouver toutes les catégories pour ce titre
        categories = parent_div.find_all("div", class_="col-span-full")
        
        for category in categories:
            category_title = category.find("h3").text.strip()
            engines = []

            # Recherche des moteurs dans chaque catégorie
            engine_divs = category.find_all("div", class_="bg-white p-2 rounded-lg text-center shadow hover:shadow-md transition duration-300")
            
            for engine_div in engine_divs:
                engine_name = engine_div.find("h3").text.strip()
                link_tag = engine_div.find_parent("a")
                engine_link = link_tag["href"] if link_tag else ""

                engines.append({"name": engine_name, "url": engine_link})

            # Ajout des informations de catégorie à la liste
            category_list.append({"category": category_title, "engines": engines})

    # Ajout de chaque titre h2 et de ses catégories à la structure JSON
    data["titles"].append({"title": title_text, "categories": category_list})

# Conversion en JSON et affichage
json_data = json.dumps(data, indent=4, ensure_ascii=False)
print(json_data)
