import json
from bs4 import BeautifulSoup
from googletrans import Translator

# Remplace ceci par ton HTML
html_content = """<div class="flex-1">
            <!-- Sort and Filter Controls -->
            <div class="bg-white rounded-lg shadow-md p-4 mb-6">
                <div class="flex flex-wrap items-center justify-between gap-4">
                    <div class="flex items-center space-x-4">
                        <label for="sortBy" class="text-sm font-medium text-gray-700">Sıralama:</label>
                        <select id="sortBy" wire:model.live="sortBy" class="h-10 pl-3 pr-8 border-gray-200 rounded-lg text-sm focus:border-orange-500 focus:ring-orange-500">
                            <option value="newest">En Yeniler</option>
                            <option value="price_asc">Fiyat (Düşükten Yükseğe)</option>
                            <option value="price_desc">Fiyat (Yüksekten Düşüğe)</option>
                            <option value="name_asc">İsim (A-Z)</option>
                            <option value="name_desc">İsim (Z-A)</option>
                        </select>
                    </div>

                    <!-- <div class="flex items-center space-x-4">
                        <label for="perPage" class="text-sm font-medium text-gray-700">Sayfa başına:</label>
                        <select id="perPage" wire:model.live="perPage" class="h-10 pl-3 pr-8 border-gray-200 rounded-lg text-sm focus:border-orange-500 focus:ring-orange-500">
                            <option value="24">24 ürün</option>
                            <option value="48">48 ürün</option>
                            <option value="96">96 ürün</option>
                        </select>
                    </div> -->
                </div>
            </div>

            <!-- Products Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <!--[if BLOCK]><![endif]-->                <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <a href="https://aloparca.com/product/bsg-65900054-dis-dikiz-aynasi-sol-elektrikli-isitmali" class="block" wire:navigate="">
                        <div class="aspect-w-1 aspect-h-1">
                            <!--[if BLOCK]><![endif]-->                            <img src="https://bcdn.aloparca.com/yedek-parca-resimleri/4455/fbfe371f46ebbee9a93affc5d64cff72e10787da.webp?width=358&amp;height=358" alt="Dikiz Aynası" class="w-full h-full object-contain p-4">
                            <!--[if ENDBLOCK]><![endif]-->
                        </div>

                        <div class="p-4">
                            <h3 class="text-sm font-medium text-gray-900 mb-2">Dikiz Aynası</h3>

                            <div class="flex items-center justify-between">
                                <span class="text-lg font-bold text-orange-600">
                                    2.048,61 TL
                                </span>

                                <span class="text-sm text-green-600">
                                    Stokta
                                </span>
                            </div>
                        </div>
                    </a>
                </div>
                                <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <a href="https://aloparca.com/product/bsg-90720008-turbo-hortumu" class="block" wire:navigate="">
                        <div class="aspect-w-1 aspect-h-1">
                            <!--[if BLOCK]><![endif]-->                            <img src="https://bcdn.aloparca.com/yedek-parca-resimleri/4455/0a0c0e581d751590058acba206a4edcc1f626a07.webp?width=358&amp;height=358" alt="Turbo Hortum ve Conta" class="w-full h-full object-contain p-4">
                            <!--[if ENDBLOCK]><![endif]-->
                        </div>

                        <div class="p-4">
                            <h3 class="text-sm font-medium text-gray-900 mb-2">Turbo Hortum ve Conta</h3>

                            <div class="flex items-center justify-between">
                                <span class="text-lg font-bold text-orange-600">
                                    910,34 TL
                                </span>

                                <span class="text-sm text-green-600">
                                    Stokta
                                </span>
                            </div>
                        </div>
                    </a>
                </div>
                                <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <a href="https://aloparca.com/product/bsg-90700149-motor-takozu-sag-23012-30716-01" class="block" wire:navigate="">
                        <div class="aspect-w-1 aspect-h-1">
                            <!--[if BLOCK]><![endif]-->                            <img src="https://bcdn.aloparca.com/yedek-parca-resimleri/4455/08df7ac8beaba3ea2bbebe7778f9531d90d43670.webp?width=358&amp;height=358" alt="Motor Takozu" class="w-full h-full object-contain p-4">
                            <!--[if ENDBLOCK]><![endif]-->
                        </div>

                        <div class="p-4">
                            <h3 class="text-sm font-medium text-gray-900 mb-2">Motor Takozu</h3>

                            <div class="flex items-center justify-between">
                                <span class="text-lg font-bold text-orange-600">
                                    1.969,19 TL
                                </span>

                                <span class="text-sm text-green-600">
                                    Stokta
                                </span>
                            </div>
                        </div>
                    </a>
                </div>
                                <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <a href="https://aloparca.com/product/bsg-90700162-viraj-demir-lastigi-on-31343-26-mm" class="block" wire:navigate="">
                        <div class="aspect-w-1 aspect-h-1">
                            <!--[if BLOCK]><![endif]-->                            <img src="https://bcdn.aloparca.com/yedek-parca-resimleri/4455/d2f1070c72e5a2782d8ef5771ab08f32a84d3675.webp?width=358&amp;height=358" alt="Viraj Demir Lastiği" class="w-full h-full object-contain p-4">
                            <!--[if ENDBLOCK]><![endif]-->
                        </div>

                        <div class="p-4">
                            <h3 class="text-sm font-medium text-gray-900 mb-2">Viraj Demir Lastiği</h3>

                            <div class="flex items-center justify-between">
                                <span class="text-lg font-bold text-orange-600">
                                    66,34 TL
                                </span>

                                <span class="text-sm text-green-600">
                                    Stokta
                                </span>
                            </div>
                        </div>
                    </a>
                </div>
                                <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <a href="https://aloparca.com/product/bsg-90700179-motor-takozu-orta-33140-01" class="block" wire:navigate="">
                        <div class="aspect-w-1 aspect-h-1">
                            <!--[if BLOCK]><![endif]-->                            <img src="https://bcdn.aloparca.com/yedek-parca-resimleri/4455/11c63454b7a0b8d8ba6b0d8f2d23f8652e153cb7.webp?width=358&amp;height=358" alt="Motor Takozu" class="w-full h-full object-contain p-4">
                            <!--[if ENDBLOCK]><![endif]-->
                        </div>

                        <div class="p-4">
                            <h3 class="text-sm font-medium text-gray-900 mb-2">Motor Takozu</h3>

                            <div class="flex items-center justify-between">
                                <span class="text-lg font-bold text-orange-600">
                                    862,76 TL
                                </span>

                                <span class="text-sm text-green-600">
                                    Stokta
                                </span>
                            </div>
                        </div>
                    </a>
                </div>
                                <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <a href="https://aloparca.com/product/bsg-90700226-viraj-demir-lastigi-on-31348-18-mm" class="block" wire:navigate="">
                        <div class="aspect-w-1 aspect-h-1">
                            <!--[if BLOCK]><![endif]-->                            <img src="https://bcdn.aloparca.com/yedek-parca-resimleri/4455/ee49d650b1823aedf3e99db08426119a98feebce.webp?width=358&amp;height=358" alt="Viraj Demir Lastiği" class="w-full h-full object-contain p-4">
                            <!--[if ENDBLOCK]><![endif]-->
                        </div>

                        <div class="p-4">
                            <h3 class="text-sm font-medium text-gray-900 mb-2">Viraj Demir Lastiği</h3>

                            <div class="flex items-center justify-between">
                                <span class="text-lg font-bold text-orange-600">
                                    50,80 TL
                                </span>

                                <span class="text-sm text-green-600">
                                    Stokta
                                </span>
                            </div>
                        </div>
                    </a>
                </div>
                                <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <a href="https://aloparca.com/product/bsg-90700114-motor-takozu-sol" class="block" wire:navigate="">
                        <div class="aspect-w-1 aspect-h-1">
                            <!--[if BLOCK]><![endif]-->                            <img src="https://bcdn.aloparca.com/yedek-parca-resimleri/4455/ee106851e3af12a2ef65a3dc11ce33476a05d8c1.webp?width=358&amp;height=358" alt="Motor Takozu" class="w-full h-full object-contain p-4">
                            <!--[if ENDBLOCK]><![endif]-->
                        </div>

                        <div class="p-4">
                            <h3 class="text-sm font-medium text-gray-900 mb-2">Motor Takozu</h3>

                            <div class="flex items-center justify-between">
                                <span class="text-lg font-bold text-orange-600">
                                    1.238,22 TL
                                </span>

                                <span class="text-sm text-green-600">
                                    Stokta
                                </span>
                            </div>
                        </div>
                    </a>
                </div>
                                <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <a href="https://aloparca.com/product/bsg-90700052-motor-takozu-sag-18856-17680-02" class="block" wire:navigate="">
                        <div class="aspect-w-1 aspect-h-1">
                            <!--[if BLOCK]><![endif]-->                            <img src="https://bcdn.aloparca.com/yedek-parca-resimleri/4455/0e967cba4b08db1574863e51e73d15c907397c23.webp?width=358&amp;height=358" alt="Motor Takozu" class="w-full h-full object-contain p-4">
                            <!--[if ENDBLOCK]><![endif]-->
                        </div>

                        <div class="p-4">
                            <h3 class="text-sm font-medium text-gray-900 mb-2">Motor Takozu</h3>

                            <div class="flex items-center justify-between">
                                <span class="text-lg font-bold text-orange-600">
                                    1.222,73 TL
                                </span>

                                <span class="text-sm text-green-600">
                                    Stokta
                                </span>
                            </div>
                        </div>
                    </a>
                </div>
                                <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <a href="https://aloparca.com/product/bsg-79923008-camurluk-davlumbazi-on-sag-onun-arkasi" class="block" wire:navigate="">
                        <div class="aspect-w-1 aspect-h-1">
                            <!--[if BLOCK]><![endif]-->                            <img src="https://bcdn.aloparca.com/yedek-parca-resimleri/4455/b3e00d0ce2d7944cff5695a0103ab396bf8d506a.webp?width=358&amp;height=358" alt="Çamurluk Davlumbazı" class="w-full h-full object-contain p-4">
                            <!--[if ENDBLOCK]><![endif]-->
                        </div>

                        <div class="p-4">
                            <h3 class="text-sm font-medium text-gray-900 mb-2">Çamurluk Davlumbazı</h3>

                            <div class="flex items-center justify-between">
                                <span class="text-lg font-bold text-orange-600">
                                    276,81 TL
                                </span>

                                <span class="text-sm text-green-600">
                                    Stokta
                                </span>
                            </div>
                        </div>
                    </a>
                </div>
                                <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <a href="https://aloparca.com/product/bsg-90900028-dis-dikiz-aynasi-sag-e-1904-373ehr-normal-katlanir" class="block" wire:navigate="">
                        <div class="aspect-w-1 aspect-h-1">
                            <!--[if BLOCK]><![endif]-->                            <img src="https://bcdn.aloparca.com/yedek-parca-resimleri/4455/f2615fc330b1f0c6d2a0713cc19d3da1e2f4654c.webp?width=358&amp;height=358" alt="Dikiz Aynası" class="w-full h-full object-contain p-4">
                            <!--[if ENDBLOCK]><![endif]-->
                        </div>

                        <div class="p-4">
                            <h3 class="text-sm font-medium text-gray-900 mb-2">Dikiz Aynası</h3>

                            <div class="flex items-center justify-between">
                                <span class="text-lg font-bold text-orange-600">
                                    3.163,75 TL
                                </span>

                                <span class="text-sm text-green-600">
                                    Stokta
                                </span>
                            </div>
                        </div>
                    </a>
                </div>
                                <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <a href="https://aloparca.com/product/bsg-75170001-krank-kasnagi" class="block" wire:navigate="">
                        <div class="aspect-w-1 aspect-h-1">
                            <!--[if BLOCK]><![endif]-->                            <img src="https://bcdn.aloparca.com/yedek-parca-resimleri/4455/e1deefea569fcdc50f07dbf7bbafdfbc5a1259f9.webp?width=358&amp;height=358" alt="Krank Kasnak" class="w-full h-full object-contain p-4">
                            <!--[if ENDBLOCK]><![endif]-->
                        </div>

                        <div class="p-4">
                            <h3 class="text-sm font-medium text-gray-900 mb-2">Krank Kasnak</h3>

                            <div class="flex items-center justify-between">
                                <span class="text-lg font-bold text-orange-600">
                                    971,24 TL
                                </span>

                                <span class="text-sm text-green-600">
                                    Stokta
                                </span>
                            </div>
                        </div>
                    </a>
                </div>
                                <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <a href="https://aloparca.com/product/bsg-75200008-fren-balatasi-on" class="block" wire:navigate="">
                        <div class="aspect-w-1 aspect-h-1">
                            <!--[if BLOCK]><![endif]-->                            <img src="https://bcdn.aloparca.com/yedek-parca-resimleri/4455/afb0823ae130ee80a21b17ff7a9b03eb7d7db3ba.webp?width=358&amp;height=358" alt="Fren Balatası" class="w-full h-full object-contain p-4">
                            <!--[if ENDBLOCK]><![endif]-->
                        </div>

                        <div class="p-4">
                            <h3 class="text-sm font-medium text-gray-900 mb-2">Fren Balatası</h3>

                            <div class="flex items-center justify-between">
                                <span class="text-lg font-bold text-orange-600">
                                    727,90 TL
                                </span>

                                <span class="text-sm text-green-600">
                                    Stokta
                                </span>
                            </div>
                        </div>
                    </a>
                </div>
                                <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <a href="https://aloparca.com/product/bsg-75700047-viraj-demir-lastigi-on-o18-viraj-demir-orta-lastigi" class="block" wire:navigate="">
                        <div class="aspect-w-1 aspect-h-1">
                            <!--[if BLOCK]><![endif]-->                            <img src="https://bcdn.aloparca.com/yedek-parca-resimleri/4455/9a6723ce6d39d98e7e3f5951eae2955769712ce5.webp?width=358&amp;height=358" alt="Viraj Demir Lastiği" class="w-full h-full object-contain p-4">
                            <!--[if ENDBLOCK]><![endif]-->
                        </div>

                        <div class="p-4">
                            <h3 class="text-sm font-medium text-gray-900 mb-2">Viraj Demir Lastiği</h3>

                            <div class="flex items-center justify-between">
                                <span class="text-lg font-bold text-orange-600">
                                    40,84 TL
                                </span>

                                <span class="text-sm text-green-600">
                                    Stokta
                                </span>
                            </div>
                        </div>
                    </a>
                </div>
                                <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <a href="https://aloparca.com/product/bsg-75700049-viraj-demir-lastigi-on-o24-viraj-demir-orta-lastigi" class="block" wire:navigate="">
                        <div class="aspect-w-1 aspect-h-1">
                            <!--[if BLOCK]><![endif]-->                            <img src="https://bcdn.aloparca.com/yedek-parca-resimleri/4455/ba90292466ea5c17310464c48f08939019fd642e.webp?width=358&amp;height=358" alt="Viraj Demir Lastiği" class="w-full h-full object-contain p-4">
                            <!--[if ENDBLOCK]><![endif]-->
                        </div>

                        <div class="p-4">
                            <h3 class="text-sm font-medium text-gray-900 mb-2">Viraj Demir Lastiği</h3>

                            <div class="flex items-center justify-between">
                                <span class="text-lg font-bold text-orange-600">
                                    152,36 TL
                                </span>

                                <span class="text-sm text-green-600">
                                    Stokta
                                </span>
                            </div>
                        </div>
                    </a>
                </div>
                                <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <a href="https://aloparca.com/product/bsg-75700025-amortisor-takozu-on-sag-sol" class="block" wire:navigate="">
                        <div class="aspect-w-1 aspect-h-1">
                            <!--[if BLOCK]><![endif]-->                            <img src="https://bcdn.aloparca.com/yedek-parca-resimleri/4455/3aa138c3dcc67f96fabe2a687d363b4e785c8c79.webp?width=358&amp;height=358" alt="Amortisör Tabla Takozu" class="w-full h-full object-contain p-4">
                            <!--[if ENDBLOCK]><![endif]-->
                        </div>

                        <div class="p-4">
                            <h3 class="text-sm font-medium text-gray-900 mb-2">Amortisör Tabla Takozu</h3>

                            <div class="flex items-center justify-between">
                                <span class="text-lg font-bold text-orange-600">
                                    184,80 TL
                                </span>

                                <span class="text-sm text-red-600">
                                    Stokta Yok
                                </span>
                            </div>
                        </div>
                    </a>
                </div>
                                <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <a href="https://aloparca.com/product/bsg-75350025-aks-komple-on-sag-uzunluk-724-mm-kalin-freze" class="block" wire:navigate="">
                        <div class="aspect-w-1 aspect-h-1">
                            <!--[if BLOCK]><![endif]-->                            <img src="https://bcdn.aloparca.com/yedek-parca-resimleri/4455/f3e4ce1834d2c1befcfa6324c93b871ca78a96d0.webp?width=358&amp;height=358" alt="Aks Komple" class="w-full h-full object-contain p-4">
                            <!--[if ENDBLOCK]><![endif]-->
                        </div>

                        <div class="p-4">
                            <h3 class="text-sm font-medium text-gray-900 mb-2">Aks Komple</h3>

                            <div class="flex items-center justify-between">
                                <span class="text-lg font-bold text-orange-600">
                                    1.998,74 TL
                                </span>

                                <span class="text-sm text-red-600">
                                    Stokta Yok
                                </span>
                            </div>
                        </div>
                    </a>
                </div>
                                <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <a href="https://aloparca.com/product/bsg-75705022-motor-takozu-sag-ipli-takoz" class="block" wire:navigate="">
                        <div class="aspect-w-1 aspect-h-1">
                            <!--[if BLOCK]><![endif]-->                            <img src="https://bcdn.aloparca.com/yedek-parca-resimleri/4455/3d60b233a97c130c218e6898da62be33003ae689.webp?width=358&amp;height=358" alt="Motor Takozu" class="w-full h-full object-contain p-4">
                            <!--[if ENDBLOCK]><![endif]-->
                        </div>

                        <div class="p-4">
                            <h3 class="text-sm font-medium text-gray-900 mb-2">Motor Takozu</h3>

                            <div class="flex items-center justify-between">
                                <span class="text-lg font-bold text-orange-600">
                                    636,92 TL
                                </span>

                                <span class="text-sm text-green-600">
                                    Stokta
                                </span>
                            </div>
                        </div>
                    </a>
                </div>
                                <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <a href="https://aloparca.com/product/bsg-70980033-bagaj-amortisoru" class="block" wire:navigate="">
                        <div class="aspect-w-1 aspect-h-1">
                            <!--[if BLOCK]><![endif]-->                            <img src="https://bcdn.aloparca.com/yedek-parca-resimleri/4455/e2f5d985ab797148c06bd24560609ada10984395.webp?width=358&amp;height=358" alt="Bagaj Amortisörü" class="w-full h-full object-contain p-4">
                            <!--[if ENDBLOCK]><![endif]-->
                        </div>

                        <div class="p-4">
                            <h3 class="text-sm font-medium text-gray-900 mb-2">Bagaj Amortisörü</h3>

                            <div class="flex items-center justify-between">
                                <span class="text-lg font-bold text-orange-600">
                                    162,74 TL
                                </span>

                                <span class="text-sm text-green-600">
                                    Stokta
                                </span>
                            </div>
                        </div>
                    </a>
                </div>
                                <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <a href="https://aloparca.com/product/bsg-70805021-stop-lambasi-sag-seffaf-bagaj-tek-kapi-yukari-acilir-duyusuz" class="block" wire:navigate="">
                        <div class="aspect-w-1 aspect-h-1">
                            <!--[if BLOCK]><![endif]-->                            <img src="https://bcdn.aloparca.com/yedek-parca-resimleri/4455/9e383007bb189aaa9dbb398bec8aab66af8dce6e.webp?width=358&amp;height=358" alt="Stop Lambası" class="w-full h-full object-contain p-4">
                            <!--[if ENDBLOCK]><![endif]-->
                        </div>

                        <div class="p-4">
                            <h3 class="text-sm font-medium text-gray-900 mb-2">Stop Lambası</h3>

                            <div class="flex items-center justify-between">
                                <span class="text-lg font-bold text-orange-600">
                                    629,84 TL
                                </span>

                                <span class="text-sm text-green-600">
                                    Stokta
                                </span>
                            </div>
                        </div>
                    </a>
                </div>
                                <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <a href="https://aloparca.com/product/bsg-70720214-yedek-su-depo-hortumu" class="block" wire:navigate="">
                        <div class="aspect-w-1 aspect-h-1">
                            <!--[if BLOCK]><![endif]-->                            <img src="https://bcdn.aloparca.com/yedek-parca-resimleri/4455/b7c4ab54dc6d3a2674370df2878d8e9abb0d013b.webp?width=358&amp;height=358" alt="Yakıt Hortumu" class="w-full h-full object-contain p-4">
                            <!--[if ENDBLOCK]><![endif]-->
                        </div>

                        <div class="p-4">
                            <h3 class="text-sm font-medium text-gray-900 mb-2">Yakıt Hortumu</h3>

                            <div class="flex items-center justify-between">
                                <span class="text-lg font-bold text-orange-600">
                                    183,56 TL
                                </span>

                                <span class="text-sm text-green-600">
                                    Stokta
                                </span>
                            </div>
                        </div>
                    </a>
                </div>
                                <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <a href="https://aloparca.com/product/bsg-70700093-helezon-lastigi-on" class="block" wire:navigate="">
                        <div class="aspect-w-1 aspect-h-1">
                            <!--[if BLOCK]><![endif]-->                            <img src="https://bcdn.aloparca.com/yedek-parca-resimleri/4455/ff92144368b7762ab4bfe5eaed174a52bee3c293.webp?width=358&amp;height=358" alt="Amortisör Rulmanı" class="w-full h-full object-contain p-4">
                            <!--[if ENDBLOCK]><![endif]-->
                        </div>

                        <div class="p-4">
                            <h3 class="text-sm font-medium text-gray-900 mb-2">Amortisör Rulmanı</h3>

                            <div class="flex items-center justify-between">
                                <span class="text-lg font-bold text-orange-600">
                                    209,96 TL
                                </span>

                                <span class="text-sm text-green-600">
                                    Stokta
                                </span>
                            </div>
                        </div>
                    </a>
                </div>
                                <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <a href="https://aloparca.com/product/bsg-70700118-viraj-demir-lastigi-23-mm" class="block" wire:navigate="">
                        <div class="aspect-w-1 aspect-h-1">
                            <!--[if BLOCK]><![endif]-->                            <img src="https://bcdn.aloparca.com/yedek-parca-resimleri/4455/30eec58c2d2065709454609e08f4c146ccd70800.webp?width=358&amp;height=358" alt="Viraj Demir Lastiği" class="w-full h-full object-contain p-4">
                            <!--[if ENDBLOCK]><![endif]-->
                        </div>

                        <div class="p-4">
                            <h3 class="text-sm font-medium text-gray-900 mb-2">Viraj Demir Lastiği</h3>

                            <div class="flex items-center justify-between">
                                <span class="text-lg font-bold text-orange-600">
                                    152,36 TL
                                </span>

                                <span class="text-sm text-red-600">
                                    Stokta Yok
                                </span>
                            </div>
                        </div>
                    </a>
                </div>
                                <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <a href="https://aloparca.com/product/bsg-70700037-motor-takozu-alt" class="block" wire:navigate="">
                        <div class="aspect-w-1 aspect-h-1">
                            <!--[if BLOCK]><![endif]-->                            <img src="https://bcdn.aloparca.com/yedek-parca-resimleri/4455/715438a7a270169ae143145bcc9d23dc79c02a1d.webp?width=358&amp;height=358" alt="Motor Takozu" class="w-full h-full object-contain p-4">
                            <!--[if ENDBLOCK]><![endif]-->
                        </div>

                        <div class="p-4">
                            <h3 class="text-sm font-medium text-gray-900 mb-2">Motor Takozu</h3>

                            <div class="flex items-center justify-between">
                                <span class="text-lg font-bold text-orange-600">
                                    665,81 TL
                                </span>

                                <span class="text-sm text-green-600">
                                    Stokta
                                </span>
                            </div>
                        </div>
                    </a>
                </div>
                                <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <a href="https://aloparca.com/product/bsg-70700074-viraj-demir-lastigi-on-25-mm" class="block" wire:navigate="">
                        <div class="aspect-w-1 aspect-h-1">
                            <!--[if BLOCK]><![endif]-->                            <img src="https://bcdn.aloparca.com/yedek-parca-resimleri/4455/01826b51a01d2023b09ed1fae37fda0980536beb.webp?width=358&amp;height=358" alt="Viraj Demir Lastiği" class="w-full h-full object-contain p-4">
                            <!--[if ENDBLOCK]><![endif]-->
                        </div>

                        <div class="p-4">
                            <h3 class="text-sm font-medium text-gray-900 mb-2">Viraj Demir Lastiği</h3>

                            <div class="flex items-center justify-between">
                                <span class="text-lg font-bold text-orange-600">
                                    138,62 TL
                                </span>

                                <span class="text-sm text-green-600">
                                    Stokta
                                </span>
                            </div>
                        </div>
                    </a>
                </div>
                <!--[if ENDBLOCK]><![endif]-->
            </div>

            <!-- Pagination -->
            <!--[if BLOCK]><![endif]-->            <div class="mt-8">
                <!-- resources/views/vendor/livewire/tailwind.blade.php -->

    <div>
    <!--[if BLOCK]><![endif]-->    <nav role="navigation" aria-label="Sayfalama Navigasyonu" class="flex items-center justify-between my-8">
        <div class="flex justify-between flex-1 md:hidden">
            <!--[if BLOCK]><![endif]-->            <span class="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 cursor-not-allowed rounded-md">
                Önceki
            </span>
            <!--[if ENDBLOCK]><![endif]-->

            <!--[if BLOCK]><![endif]-->            <button wire:click="nextPage('page')" x-on:click="($el.closest('body') || document.querySelector('body')).scrollIntoView()" wire:loading.attr="disabled" class="relative inline-flex items-center px-4 py-2 ml-3 text-sm font-medium text-blue-700 bg-white border border-blue-300 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition ease-in-out duration-150">
                Sonraki
            </button>
            <!--[if ENDBLOCK]><![endif]-->
        </div>

        <div class="hidden md:flex-1 md:flex md:items-center md:justify-between">
            <div>
                <p class="text-sm text-gray-700 leading-5">
                    Gösterilen
                    <span class="font-medium">1</span>
                    -
                    <span class="font-medium">24</span>
                    /
                    <span class="font-medium">10322</span>
                    sonuç
                </p>
            </div>

            <div>
                <span class="relative z-0 inline-flex rounded-md shadow-sm">
                    
                    <!--[if BLOCK]><![endif]-->                    <span aria-disabled="true" aria-label="&amp;laquo; Önceki">
                        <span class="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 cursor-default rounded-l-md leading-5" aria-hidden="true">
                            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                            </svg>
                        </span>
                    </span>
                    <!--[if ENDBLOCK]><![endif]-->

                    
                    <!--[if BLOCK]><![endif]-->                    <!--[if BLOCK]><![endif]--><!--[if ENDBLOCK]><![endif]-->

                    <!--[if BLOCK]><![endif]-->                    <!--[if BLOCK]><![endif]-->                    <span wire:key="paginator-page-page1">
                        <!--[if BLOCK]><![endif]-->                        <span aria-current="page">
                            <span class="relative inline-flex items-center px-4 py-2 -ml-px text-sm font-medium text-white bg-blue-600 border border-blue-600 cursor-default leading-5">1</span>
                        </span>
                        <!--[if ENDBLOCK]><![endif]-->
                    </span>
                                        <span wire:key="paginator-page-page2">
                        <!--[if BLOCK]><![endif]-->                        <button wire:click="gotoPage(2, 'page')" x-on:click="($el.closest('body') || document.querySelector('body')).scrollIntoView()" class="relative inline-flex items-center px-4 py-2 -ml-px text-sm font-medium text-gray-700 bg-white border border-gray-300 leading-5 hover:text-gray-500 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150" aria-label="Go to page 2">
                            2
                        </button>
                        <!--[if ENDBLOCK]><![endif]-->
                    </span>
                                        <span wire:key="paginator-page-page3">
                        <!--[if BLOCK]><![endif]-->                        <button wire:click="gotoPage(3, 'page')" x-on:click="($el.closest('body') || document.querySelector('body')).scrollIntoView()" class="relative inline-flex items-center px-4 py-2 -ml-px text-sm font-medium text-gray-700 bg-white border border-gray-300 leading-5 hover:text-gray-500 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150" aria-label="Go to page 3">
                            3
                        </button>
                        <!--[if ENDBLOCK]><![endif]-->
                    </span>
                                        <span wire:key="paginator-page-page4">
                        <!--[if BLOCK]><![endif]-->                        <button wire:click="gotoPage(4, 'page')" x-on:click="($el.closest('body') || document.querySelector('body')).scrollIntoView()" class="relative inline-flex items-center px-4 py-2 -ml-px text-sm font-medium text-gray-700 bg-white border border-gray-300 leading-5 hover:text-gray-500 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150" aria-label="Go to page 4">
                            4
                        </button>
                        <!--[if ENDBLOCK]><![endif]-->
                    </span>
                                        <span wire:key="paginator-page-page5">
                        <!--[if BLOCK]><![endif]-->                        <button wire:click="gotoPage(5, 'page')" x-on:click="($el.closest('body') || document.querySelector('body')).scrollIntoView()" class="relative inline-flex items-center px-4 py-2 -ml-px text-sm font-medium text-gray-700 bg-white border border-gray-300 leading-5 hover:text-gray-500 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150" aria-label="Go to page 5">
                            5
                        </button>
                        <!--[if ENDBLOCK]><![endif]-->
                    </span>
                                        <span wire:key="paginator-page-page6">
                        <!--[if BLOCK]><![endif]-->                        <button wire:click="gotoPage(6, 'page')" x-on:click="($el.closest('body') || document.querySelector('body')).scrollIntoView()" class="relative inline-flex items-center px-4 py-2 -ml-px text-sm font-medium text-gray-700 bg-white border border-gray-300 leading-5 hover:text-gray-500 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150" aria-label="Go to page 6">
                            6
                        </button>
                        <!--[if ENDBLOCK]><![endif]-->
                    </span>
                                        <span wire:key="paginator-page-page7">
                        <!--[if BLOCK]><![endif]-->                        <button wire:click="gotoPage(7, 'page')" x-on:click="($el.closest('body') || document.querySelector('body')).scrollIntoView()" class="relative inline-flex items-center px-4 py-2 -ml-px text-sm font-medium text-gray-700 bg-white border border-gray-300 leading-5 hover:text-gray-500 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150" aria-label="Go to page 7">
                            7
                        </button>
                        <!--[if ENDBLOCK]><![endif]-->
                    </span>
                                        <span wire:key="paginator-page-page8">
                        <!--[if BLOCK]><![endif]-->                        <button wire:click="gotoPage(8, 'page')" x-on:click="($el.closest('body') || document.querySelector('body')).scrollIntoView()" class="relative inline-flex items-center px-4 py-2 -ml-px text-sm font-medium text-gray-700 bg-white border border-gray-300 leading-5 hover:text-gray-500 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150" aria-label="Go to page 8">
                            8
                        </button>
                        <!--[if ENDBLOCK]><![endif]-->
                    </span>
                                        <span wire:key="paginator-page-page9">
                        <!--[if BLOCK]><![endif]-->                        <button wire:click="gotoPage(9, 'page')" x-on:click="($el.closest('body') || document.querySelector('body')).scrollIntoView()" class="relative inline-flex items-center px-4 py-2 -ml-px text-sm font-medium text-gray-700 bg-white border border-gray-300 leading-5 hover:text-gray-500 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150" aria-label="Go to page 9">
                            9
                        </button>
                        <!--[if ENDBLOCK]><![endif]-->
                    </span>
                                        <span wire:key="paginator-page-page10">
                        <!--[if BLOCK]><![endif]-->                        <button wire:click="gotoPage(10, 'page')" x-on:click="($el.closest('body') || document.querySelector('body')).scrollIntoView()" class="relative inline-flex items-center px-4 py-2 -ml-px text-sm font-medium text-gray-700 bg-white border border-gray-300 leading-5 hover:text-gray-500 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150" aria-label="Go to page 10">
                            10
                        </button>
                        <!--[if ENDBLOCK]><![endif]-->
                    </span>
                    <!--[if ENDBLOCK]><![endif]-->
                    <!--[if ENDBLOCK]><![endif]-->
                                        <!--[if BLOCK]><![endif]-->                    <span aria-disabled="true">
                        <span class="relative inline-flex items-center px-4 py-2 -ml-px text-sm font-medium text-gray-700 bg-white border border-gray-300 cursor-default leading-5">...</span>
                    </span>
                    <!--[if ENDBLOCK]><![endif]-->

                    <!--[if BLOCK]><![endif]--><!--[if ENDBLOCK]><![endif]-->
                                        <!--[if BLOCK]><![endif]--><!--[if ENDBLOCK]><![endif]-->

                    <!--[if BLOCK]><![endif]-->                    <!--[if BLOCK]><![endif]-->                    <span wire:key="paginator-page-page430">
                        <!--[if BLOCK]><![endif]-->                        <button wire:click="gotoPage(430, 'page')" x-on:click="($el.closest('body') || document.querySelector('body')).scrollIntoView()" class="relative inline-flex items-center px-4 py-2 -ml-px text-sm font-medium text-gray-700 bg-white border border-gray-300 leading-5 hover:text-gray-500 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150" aria-label="Go to page 430">
                            430
                        </button>
                        <!--[if ENDBLOCK]><![endif]-->
                    </span>
                                        <span wire:key="paginator-page-page431">
                        <!--[if BLOCK]><![endif]-->                        <button wire:click="gotoPage(431, 'page')" x-on:click="($el.closest('body') || document.querySelector('body')).scrollIntoView()" class="relative inline-flex items-center px-4 py-2 -ml-px text-sm font-medium text-gray-700 bg-white border border-gray-300 leading-5 hover:text-gray-500 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150" aria-label="Go to page 431">
                            431
                        </button>
                        <!--[if ENDBLOCK]><![endif]-->
                    </span>
                    <!--[if ENDBLOCK]><![endif]-->
                    <!--[if ENDBLOCK]><![endif]-->
                    <!--[if ENDBLOCK]><![endif]-->

                    
                    <!--[if BLOCK]><![endif]-->                    <button wire:click="nextPage('page')" x-on:click="($el.closest('body') || document.querySelector('body')).scrollIntoView()" rel="next" class="relative inline-flex items-center px-2 py-2 -ml-px text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md leading-5 hover:text-gray-400 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-500 transition ease-in-out duration-150" aria-label="Sonraki &amp;raquo;">
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
                        </svg>
                    </button>
                    <!--[if ENDBLOCK]><![endif]-->
                </span>
            </div>
        </div>
    </nav>
    <!--[if ENDBLOCK]><![endif]-->
    </div>
            </div>
            <!--[if ENDBLOCK]><![endif]-->
        </div>"""


soup = BeautifulSoup(html_content, "html.parser")
translator = GoogleTranslator(source="tr", target="en")

products = []
for product_card in soup.select(".bg-white.rounded-lg.shadow-md.overflow-hidden"):
    name = product_card.select_one("h3")
    name = name.get_text(strip=True) if name else "Unknown Product"

    price = product_card.select_one("span.text-lg.font-bold.text-orange-600")
    price = price.get_text(strip=True) if price else "Price Not Available"

    availability = product_card.select_one("span.text-sm.text-green-600")
    availability = availability.get_text(strip=True) if availability else "Unknown Availability"

    link = product_card.select_one("a.block")
    link = link["href"] if link else "#"

    image = product_card.select_one("img")
    image = image["src"] if image else ""

    # Traduction en anglais
    name_en = translator.translate(name) if name else "Unknown Product"
    availability_en = translator.translate(availability) if availability else "Unknown Availability"

    products.append({
        "name": name_en,
        "price": price,
        "availability": availability_en,
        "link": link,
        "image": image,
    })

# Sauvegarde des données dans un fichier JSON
with open("products.json", "w", encoding="utf-8") as json_file:
    json.dump(products, json_file, indent=4, ensure_ascii=False)

print("✅ Les données des produits ont été enregistrées dans 'products.json'.")
