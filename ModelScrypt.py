from bs4 import BeautifulSoup
import json

html = """<div class="bg-white p-4 rounded-[3px] shadow mb-6 mt-3">
        <h2 class="text-xl font-bold mb-4">TOYOTA Modelleri</h2>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <!--[if BLOCK]><![endif]-->            <div :class="{'hidden': 0 >= 10 &amp;&amp; !showAllModels}">
                <a href="https://aloparca.com/oto-yedek-parca/toyota/toyota-yaris" wire:navigate="" class="block" title="TOYOTA YARIS Yedek Parça">
                    <div class=" bg-gray-100 p-2 rounded-lg text-center hover:shadow-md transition duration-300">
                        <!--[if BLOCK]><![endif]-->                        <img src="https://bcdn.aloparca.com/car-images/Geu85wpFcFmW9I3s4VJjSVz1z5aYzaRPRW4aocRd.png?width=219" alt="YARIS TOYOTA" class="w-full h-32 object-contain mb-2" loading="eager">
                        <!--[if ENDBLOCK]><![endif]-->
                        <h3 class="text-sm font-semibold">YARIS</h3>
                        <p class="text-xs text-gray-500">1999'den itibaren</p>
                    </div>
                </a>
            </div>
                        <div :class="{'hidden': 1 >= 10 &amp;&amp; !showAllModels}">
                <a href="https://aloparca.com/oto-yedek-parca/toyota/toyota-avensis" wire:navigate="" class="block" title="TOYOTA AVENSIS Yedek Parça">
                    <div class=" bg-gray-100 p-2 rounded-lg text-center hover:shadow-md transition duration-300">
                        <!--[if BLOCK]><![endif]-->                        <img src="https://bcdn.aloparca.com/car-images/CNnLbPdWydD2A5LL4nW6Ojguwf9z5ELAO5yVgAyq.png?width=219" alt="AVENSIS TOYOTA" class="w-full h-32 object-contain mb-2" loading="eager">
                        <!--[if ENDBLOCK]><![endif]-->
                        <h3 class="text-sm font-semibold">AVENSIS</h3>
                        <p class="text-xs text-gray-500">1997'den itibaren</p>
                    </div>
                </a>
            </div>
                        <div :class="{'hidden': 2 >= 10 &amp;&amp; !showAllModels}">
                <a href="https://aloparca.com/oto-yedek-parca/toyota/toyota-corolla" wire:navigate="" class="block" title="TOYOTA COROLLA Yedek Parça">
                    <div class=" bg-gray-100 p-2 rounded-lg text-center hover:shadow-md transition duration-300">
                        <!--[if BLOCK]><![endif]-->                        <img src="https://bcdn.aloparca.com/car-images/EBgGCy9AmlD7vZl2sCbpPBVqQ6oRE9cwIyecxMEn.png?width=219" alt="COROLLA TOYOTA" class="w-full h-32 object-contain mb-2" loading="eager">
                        <!--[if ENDBLOCK]><![endif]-->
                        <h3 class="text-sm font-semibold">COROLLA</h3>
                        <p class="text-xs text-gray-500">1970'den itibaren</p>
                    </div>
                </a>
            </div>
                        <div :class="{'hidden': 3 >= 10 &amp;&amp; !showAllModels}">
                <a href="https://aloparca.com/oto-yedek-parca/toyota/toyota-auris" wire:navigate="" class="block" title="TOYOTA AURIS Yedek Parça">
                    <div class=" bg-gray-100 p-2 rounded-lg text-center hover:shadow-md transition duration-300">
                        <!--[if BLOCK]><![endif]-->                        <img src="https://bcdn.aloparca.com/car-images/yVbAueitferzWzOqvRITy6KhRwli4MxDLxlYqf4p.png?width=219" alt="AURIS TOYOTA" class="w-full h-32 object-contain mb-2" loading="eager">
                        <!--[if ENDBLOCK]><![endif]-->
                        <h3 class="text-sm font-semibold">AURIS</h3>
                        <p class="text-xs text-gray-500">2006'den itibaren</p>
                    </div>
                </a>
            </div>
                        <div :class="{'hidden': 4 >= 10 &amp;&amp; !showAllModels}">
                <a href="https://aloparca.com/oto-yedek-parca/toyota/toyota-aygo" wire:navigate="" class="block" title="TOYOTA AYGO Yedek Parça">
                    <div class=" bg-gray-100 p-2 rounded-lg text-center hover:shadow-md transition duration-300">
                        <!--[if BLOCK]><![endif]-->                        <img src="https://bcdn.aloparca.com/car-images/Ww6ojf42rxUjKjZZmusSLLj0tgOi1woftL3G6wq4.png?width=219" alt="AYGO TOYOTA" class="w-full h-32 object-contain mb-2" loading="eager">
                        <!--[if ENDBLOCK]><![endif]-->
                        <h3 class="text-sm font-semibold">AYGO</h3>
                        <p class="text-xs text-gray-500">2005'den itibaren</p>
                    </div>
                </a>
            </div>
                        <div :class="{'hidden': 5 >= 10 &amp;&amp; !showAllModels}">
                <a href="https://aloparca.com/oto-yedek-parca/toyota/toyota-land-cruiser" wire:navigate="" class="block" title="TOYOTA LAND CRUISER Yedek Parça">
                    <div class=" bg-gray-100 p-2 rounded-lg text-center hover:shadow-md transition duration-300">
                        <!--[if BLOCK]><![endif]-->                        <img src="https://bcdn.aloparca.com/car-images/9NOvxRbb9AhmKvFg8RGnfSpjcWDBH5fBEvfR1y8q.png?width=219" alt="LAND CRUISER TOYOTA" class="w-full h-32 object-contain mb-2" loading="eager">
                        <!--[if ENDBLOCK]><![endif]-->
                        <h3 class="text-sm font-semibold">LAND CRUISER</h3>
                        <p class="text-xs text-gray-500">1960'den itibaren</p>
                    </div>
                </a>
            </div>
                        <div :class="{'hidden': 6 >= 10 &amp;&amp; !showAllModels}">
                <a href="https://aloparca.com/oto-yedek-parca/toyota/toyota-prius" wire:navigate="" class="block" title="TOYOTA PRIUS Yedek Parça">
                    <div class=" bg-gray-100 p-2 rounded-lg text-center hover:shadow-md transition duration-300">
                        <!--[if BLOCK]><![endif]-->                        <img src="https://bcdn.aloparca.com/car-images/HHc0uvoSkVtZK7zLUv9JjVYhiCbbJMg8qXawNn4o.png?width=219" alt="PRIUS TOYOTA" class="w-full h-32 object-contain mb-2" loading="eager">
                        <!--[if ENDBLOCK]><![endif]-->
                        <h3 class="text-sm font-semibold">PRIUS</h3>
                        <p class="text-xs text-gray-500">1997'den itibaren</p>
                    </div>
                </a>
            </div>
                        <div :class="{'hidden': 7 >= 10 &amp;&amp; !showAllModels}">
                <a href="https://aloparca.com/oto-yedek-parca/toyota/toyota-verso" wire:navigate="" class="block" title="TOYOTA VERSO Yedek Parça">
                    <div class=" bg-gray-100 p-2 rounded-lg text-center hover:shadow-md transition duration-300">
                        <!--[if BLOCK]><![endif]-->                        <img src="https://bcdn.aloparca.com/car-images/ojuIEtClVsQNWOeoyw9QIUhJb5t2JFUbo60mChBl.png?width=219" alt="VERSO TOYOTA" class="w-full h-32 object-contain mb-2" loading="eager">
                        <!--[if ENDBLOCK]><![endif]-->
                        <h3 class="text-sm font-semibold">VERSO</h3>
                        <p class="text-xs text-gray-500">2009'den itibaren</p>
                    </div>
                </a>
            </div>
                        <div :class="{'hidden': 8 >= 10 &amp;&amp; !showAllModels}">
                <a href="https://aloparca.com/oto-yedek-parca/toyota/toyota-c-hr" wire:navigate="" class="block" title="TOYOTA C-HR Yedek Parça">
                    <div class=" bg-gray-100 p-2 rounded-lg text-center hover:shadow-md transition duration-300">
                        <!--[if BLOCK]><![endif]-->                        <img src="https://bcdn.aloparca.com/car-images/bFQ9DRyErZn2TfImD3ufDrTREFEqoI4DbB6QcgSE.png?width=219" alt="C-HR TOYOTA" class="w-full h-32 object-contain mb-2" loading="eager">
                        <!--[if ENDBLOCK]><![endif]-->
                        <h3 class="text-sm font-semibold">C-HR</h3>
                        <p class="text-xs text-gray-500">2016'den itibaren</p>
                    </div>
                </a>
            </div>
                        <div :class="{'hidden': 9 >= 10 &amp;&amp; !showAllModels}">
                <a href="https://aloparca.com/oto-yedek-parca/toyota/toyota-celica" wire:navigate="" class="block" title="TOYOTA CELICA Yedek Parça">
                    <div class=" bg-gray-100 p-2 rounded-lg text-center hover:shadow-md transition duration-300">
                        <!--[if BLOCK]><![endif]-->                        <img src="https://bcdn.aloparca.com/car-images/Rgx8RUhPDA4bL7reSgiTy9ibDDFPxJPcD5fbCXKB.png?width=219" alt="CELICA TOYOTA" class="w-full h-32 object-contain mb-2" loading="eager">
                        <!--[if ENDBLOCK]><![endif]-->
                        <h3 class="text-sm font-semibold">CELICA</h3>
                        <p class="text-xs text-gray-500">1971'den itibaren</p>
                    </div>
                </a>
            </div>
                        <div :class="{'hidden': 10 >= 10 &amp;&amp; !showAllModels}" class="hidden">
                <a href="https://aloparca.com/oto-yedek-parca/toyota/toyota-proace" wire:navigate="" class="block" title="TOYOTA PROACE Yedek Parça">
                    <div class=" bg-gray-100 p-2 rounded-lg text-center hover:shadow-md transition duration-300">
                        <!--[if BLOCK]><![endif]-->                        <img src="https://bcdn.aloparca.com/car-images/Rva4TWKQ60I3Hh2GganScnpemWwW1EvhFdaxl9qF.png?width=219" alt="PROACE TOYOTA" class="w-full h-32 object-contain mb-2" loading="lazy">
                        <!--[if ENDBLOCK]><![endif]-->
                        <h3 class="text-sm font-semibold">PROACE</h3>
                        <p class="text-xs text-gray-500">2013'den itibaren</p>
                    </div>
                </a>
            </div>
                        <div :class="{'hidden': 11 >= 10 &amp;&amp; !showAllModels}" class="hidden">
                <a href="https://aloparca.com/oto-yedek-parca/toyota/toyota-starlet" wire:navigate="" class="block" title="TOYOTA STARLET Yedek Parça">
                    <div class=" bg-gray-100 p-2 rounded-lg text-center hover:shadow-md transition duration-300">
                        <!--[if BLOCK]><![endif]-->                        <img src="https://bcdn.aloparca.com/car-images/IFpP4SGJCiuXBRrli6lxNDx3kMR0TDMTStTWbaTJ.png?width=219" alt="STARLET TOYOTA" class="w-full h-32 object-contain mb-2" loading="lazy">
                        <!--[if ENDBLOCK]><![endif]-->
                        <h3 class="text-sm font-semibold">STARLET</h3>
                        <p class="text-xs text-gray-500">1974'den itibaren</p>
                    </div>
                </a>
            </div>
                        <div :class="{'hidden': 12 >= 10 &amp;&amp; !showAllModels}" class="hidden">
                <a href="https://aloparca.com/oto-yedek-parca/toyota/toyota-iq" wire:navigate="" class="block" title="TOYOTA IQ Yedek Parça">
                    <div class=" bg-gray-100 p-2 rounded-lg text-center hover:shadow-md transition duration-300">
                        <!--[if BLOCK]><![endif]-->                        <img src="https://bcdn.aloparca.com/car-images/e8MuIMhti8xL6wuHw0IHm2CaDHfwO3FPojAY5cRq.png?width=219" alt="IQ TOYOTA" class="w-full h-32 object-contain mb-2" loading="lazy">
                        <!--[if ENDBLOCK]><![endif]-->
                        <h3 class="text-sm font-semibold">IQ</h3>
                        <p class="text-xs text-gray-500">2008'den itibaren</p>
                    </div>
                </a>
            </div>
                        <div :class="{'hidden': 13 >= 10 &amp;&amp; !showAllModels}" class="hidden">
                <a href="https://aloparca.com/oto-yedek-parca/toyota/toyota-gt-86" wire:navigate="" class="block" title="TOYOTA GT 86 Yedek Parça">
                    <div class=" bg-gray-100 p-2 rounded-lg text-center hover:shadow-md transition duration-300">
                        <!--[if BLOCK]><![endif]-->                        <img src="https://bcdn.aloparca.com/car-images/d6ebqnyEeKkqBvoRmaomOJKSErc4bW6zhj0VgTNv.png?width=219" alt="GT 86 TOYOTA" class="w-full h-32 object-contain mb-2" loading="lazy">
                        <!--[if ENDBLOCK]><![endif]-->
                        <h3 class="text-sm font-semibold">GT 86</h3>
                        <p class="text-xs text-gray-500">2012'den itibaren</p>
                    </div>
                </a>
            </div>
                        <div :class="{'hidden': 14 >= 10 &amp;&amp; !showAllModels}" class="hidden">
                <a href="https://aloparca.com/oto-yedek-parca/toyota/toyota-camry" wire:navigate="" class="block" title="TOYOTA CAMRY Yedek Parça">
                    <div class=" bg-gray-100 p-2 rounded-lg text-center hover:shadow-md transition duration-300">
                        <!--[if BLOCK]><![endif]-->                        <img src="https://bcdn.aloparca.com/car-images/bneiVybUcPe6Zz1ES25M2lXNivMyeeKdmajSVH7R.png?width=219" alt="CAMRY TOYOTA" class="w-full h-32 object-contain mb-2" loading="lazy">
                        <!--[if ENDBLOCK]><![endif]-->
                        <h3 class="text-sm font-semibold">CAMRY</h3>
                        <p class="text-xs text-gray-500">1983'den itibaren</p>
                    </div>
                </a>
            </div>
                        <div :class="{'hidden': 15 >= 10 &amp;&amp; !showAllModels}" class="hidden">
                <a href="https://aloparca.com/oto-yedek-parca/toyota/toyota-supra" wire:navigate="" class="block" title="TOYOTA SUPRA Yedek Parça">
                    <div class=" bg-gray-100 p-2 rounded-lg text-center hover:shadow-md transition duration-300">
                        <!--[if BLOCK]><![endif]-->                        <img src="https://bcdn.aloparca.com/car-images/ITmHlEbHwA3yDJoaLjKTdV8oXHwESHsBm80rjwj0.png?width=219" alt="SUPRA TOYOTA" class="w-full h-32 object-contain mb-2" loading="lazy">
                        <!--[if ENDBLOCK]><![endif]-->
                        <h3 class="text-sm font-semibold">SUPRA</h3>
                        <p class="text-xs text-gray-500">1986'den itibaren</p>
                    </div>
                </a>
            </div>
                        <div :class="{'hidden': 16 >= 10 &amp;&amp; !showAllModels}" class="hidden">
                <a href="https://aloparca.com/oto-yedek-parca/toyota/toyota-hiace" wire:navigate="" class="block" title="TOYOTA HIACE Yedek Parça">
                    <div class=" bg-gray-100 p-2 rounded-lg text-center hover:shadow-md transition duration-300">
                        <!--[if BLOCK]><![endif]-->                        <img src="https://bcdn.aloparca.com/car-images/gK7tFm7MyC0cdrD3yo1p3ZhW8qzbVJOCYT6qF1Ok.png?width=219" alt="HIACE TOYOTA" class="w-full h-32 object-contain mb-2" loading="lazy">
                        <!--[if ENDBLOCK]><![endif]-->
                        <h3 class="text-sm font-semibold">HIACE</h3>
                        <p class="text-xs text-gray-500">1967'den itibaren</p>
                    </div>
                </a>
            </div>
                        <div :class="{'hidden': 17 >= 10 &amp;&amp; !showAllModels}" class="hidden">
                <a href="https://aloparca.com/oto-yedek-parca/toyota/toyota-verso-s" wire:navigate="" class="block" title="TOYOTA VERSO S Yedek Parça">
                    <div class=" bg-gray-100 p-2 rounded-lg text-center hover:shadow-md transition duration-300">
                        <!--[if BLOCK]><![endif]-->                        <img src="https://bcdn.aloparca.com/car-images/z8YYsxXOI9wCj4uRoiLXFs9jjgRun0foJq5Zxdmt.png?width=219" alt="VERSO S TOYOTA" class="w-full h-32 object-contain mb-2" loading="lazy">
                        <!--[if ENDBLOCK]><![endif]-->
                        <h3 class="text-sm font-semibold">VERSO S</h3>
                        <p class="text-xs text-gray-500">2010'den itibaren</p>
                    </div>
                </a>
            </div>
                        <div :class="{'hidden': 18 >= 10 &amp;&amp; !showAllModels}" class="hidden">
                <a href="https://aloparca.com/oto-yedek-parca/toyota/toyota-carina" wire:navigate="" class="block" title="TOYOTA CARINA Yedek Parça">
                    <div class=" bg-gray-100 p-2 rounded-lg text-center hover:shadow-md transition duration-300">
                        <!--[if BLOCK]><![endif]-->                        <img src="https://bcdn.aloparca.com/car-images/xZGHnCNtnoo8Z7yVxSoZyiND9UPRyYIxuQnleA6u.png?width=219" alt="CARINA TOYOTA" class="w-full h-32 object-contain mb-2" loading="lazy">
                        <!--[if ENDBLOCK]><![endif]-->
                        <h3 class="text-sm font-semibold">CARINA</h3>
                        <p class="text-xs text-gray-500">1970'den itibaren</p>
                    </div>
                </a>
            </div>
                        <div :class="{'hidden': 19 >= 10 &amp;&amp; !showAllModels}" class="hidden">
                <a href="https://aloparca.com/oto-yedek-parca/toyota/toyota-proace-verso" wire:navigate="" class="block" title="TOYOTA PROACE VERSO Yedek Parça">
                    <div class=" bg-gray-100 p-2 rounded-lg text-center hover:shadow-md transition duration-300">
                        <!--[if BLOCK]><![endif]-->                        <img src="https://bcdn.aloparca.com/car-images/D5TOQkjvKHcuXW2zlz2xLOa5wA1aysMotwknpPOz.png?width=219" alt="PROACE VERSO TOYOTA" class="w-full h-32 object-contain mb-2" loading="lazy">
                        <!--[if ENDBLOCK]><![endif]-->
                        <h3 class="text-sm font-semibold">PROACE VERSO</h3>
                        <p class="text-xs text-gray-500">2016'den itibaren</p>
                    </div>
                </a>
            </div>
                        <div :class="{'hidden': 20 >= 10 &amp;&amp; !showAllModels}" class="hidden">
                <a href="https://aloparca.com/oto-yedek-parca/toyota/toyota-urban-cruiser" wire:navigate="" class="block" title="TOYOTA URBAN CRUISER Yedek Parça">
                    <div class=" bg-gray-100 p-2 rounded-lg text-center hover:shadow-md transition duration-300">
                        <!--[if BLOCK]><![endif]-->                        <img src="https://bcdn.aloparca.com/car-images/QmLh0xZGGcAmBTjuPVKhkQTH1JZT78RxGeCBl8vW.png?width=219" alt="URBAN CRUISER TOYOTA" class="w-full h-32 object-contain mb-2" loading="lazy">
                        <!--[if ENDBLOCK]><![endif]-->
                        <h3 class="text-sm font-semibold">URBAN CRUISER</h3>
                        <p class="text-xs text-gray-500">2007'den itibaren</p>
                    </div>
                </a>
            </div>
                        <div :class="{'hidden': 21 >= 10 &amp;&amp; !showAllModels}" class="hidden">
                <a href="https://aloparca.com/oto-yedek-parca/toyota/toyota-paseo" wire:navigate="" class="block" title="TOYOTA PASEO Yedek Parça">
                    <div class=" bg-gray-100 p-2 rounded-lg text-center hover:shadow-md transition duration-300">
                        <!--[if BLOCK]><![endif]-->                        <img src="https://bcdn.aloparca.com/car-images/dP4YTIBWw7p59u0mqGSN1a7EnpgQc60Pbxjn520X.png?width=219" alt="PASEO TOYOTA" class="w-full h-32 object-contain mb-2" loading="lazy">
                        <!--[if ENDBLOCK]><![endif]-->
                        <h3 class="text-sm font-semibold">PASEO</h3>
                        <p class="text-xs text-gray-500">1988'den itibaren</p>
                    </div>
                </a>
            </div>
                        <div :class="{'hidden': 22 >= 10 &amp;&amp; !showAllModels}" class="hidden">
                <a href="https://aloparca.com/oto-yedek-parca/toyota/toyota-picnic" wire:navigate="" class="block" title="TOYOTA PICNIC Yedek Parça">
                    <div class=" bg-gray-100 p-2 rounded-lg text-center hover:shadow-md transition duration-300">
                        <!--[if BLOCK]><![endif]-->                        <img src="https://bcdn.aloparca.com/car-images/pW6lpDfX662b7mdGkARNoPUe7xbxE98tBmQjYBjG.png?width=219" alt="PICNIC TOYOTA" class="w-full h-32 object-contain mb-2" loading="lazy">
                        <!--[if ENDBLOCK]><![endif]-->
                        <h3 class="text-sm font-semibold">PICNIC</h3>
                        <p class="text-xs text-gray-500">1996'den itibaren</p>
                    </div>
                </a>
            </div>
                        <div :class="{'hidden': 23 >= 10 &amp;&amp; !showAllModels}" class="hidden">
                <a href="https://aloparca.com/oto-yedek-parca/toyota/toyota-agya-wigo" wire:navigate="" class="block" title="TOYOTA Agya / Wigo Yedek Parça">
                    <div class=" bg-gray-100 p-2 rounded-lg text-center hover:shadow-md transition duration-300">
                        <!--[if BLOCK]><![endif]-->                        <img src="https://bcdn.aloparca.com/car-images/qF5po4bpk3pKkOH98pZpd2NTQ2VQtk8U53bTi3Ba.png?width=219" alt="Agya / Wigo TOYOTA" class="w-full h-32 object-contain mb-2" loading="lazy">
                        <!--[if ENDBLOCK]><![endif]-->
                        <h3 class="text-sm font-semibold">Agya / Wigo</h3>
                        <p class="text-xs text-gray-500">2012'den itibaren</p>
                    </div>
                </a>
            </div>
                        <div :class="{'hidden': 24 >= 10 &amp;&amp; !showAllModels}" class="hidden">
                <a href="https://aloparca.com/oto-yedek-parca/toyota/toyota-sienna" wire:navigate="" class="block" title="TOYOTA SIENNA Yedek Parça">
                    <div class=" bg-gray-100 p-2 rounded-lg text-center hover:shadow-md transition duration-300">
                        <!--[if BLOCK]><![endif]-->                        <img src="https://bcdn.aloparca.com/car-images/1YgXGB0cPqT4Kqfy6YU8msxy9ZZI9jtNzx7o2jac.png?width=219" alt="SIENNA TOYOTA" class="w-full h-32 object-contain mb-2" loading="lazy">
                        <!--[if ENDBLOCK]><![endif]-->
                        <h3 class="text-sm font-semibold">SIENNA</h3>
                        <p class="text-xs text-gray-500">1997'den itibaren</p>
                    </div>
                </a>
            </div>
                        <div :class="{'hidden': 25 >= 10 &amp;&amp; !showAllModels}" class="hidden">
                <a href="https://aloparca.com/oto-yedek-parca/toyota/toyota-fj" wire:navigate="" class="block" title="TOYOTA FJ Yedek Parça">
                    <div class=" bg-gray-100 p-2 rounded-lg text-center hover:shadow-md transition duration-300">
                        <!--[if BLOCK]><![endif]-->                        <img src="https://bcdn.aloparca.com/car-images/PcBMIqnpbQn0dm8AVEXJCouq0R8bK5RKiycksZ3P.png?width=219" alt="FJ TOYOTA" class="w-full h-32 object-contain mb-2" loading="lazy">
                        <!--[if ENDBLOCK]><![endif]-->
                        <h3 class="text-sm font-semibold">FJ</h3>
                        <p class="text-xs text-gray-500">2006'den itibaren</p>
                    </div>
                </a>
            </div>
                        <div :class="{'hidden': 26 >= 10 &amp;&amp; !showAllModels}" class="hidden">
                <a href="https://aloparca.com/oto-yedek-parca/toyota/toyota-highlander" wire:navigate="" class="block" title="TOYOTA HIGHLANDER Yedek Parça">
                    <div class=" bg-gray-100 p-2 rounded-lg text-center hover:shadow-md transition duration-300">
                        <!--[if BLOCK]><![endif]-->                        <img src="https://bcdn.aloparca.com/car-images/OnXyQo41vDaZAgBCiSyYag5NQWKsgfrkIyfeOc1R.png?width=219" alt="HIGHLANDER TOYOTA" class="w-full h-32 object-contain mb-2" loading="lazy">
                        <!--[if ENDBLOCK]><![endif]-->
                        <h3 class="text-sm font-semibold">HIGHLANDER</h3>
                        <p class="text-xs text-gray-500">2000'den itibaren</p>
                    </div>
                </a>
            </div>
                        <div :class="{'hidden': 27 >= 10 &amp;&amp; !showAllModels}" class="hidden">
                <a href="https://aloparca.com/oto-yedek-parca/toyota/toyota-tundra" wire:navigate="" class="block" title="TOYOTA TUNDRA Yedek Parça">
                    <div class=" bg-gray-100 p-2 rounded-lg text-center hover:shadow-md transition duration-300">
                        <!--[if BLOCK]><![endif]-->                        <img src="https://bcdn.aloparca.com/car-images/oWLbm0QC58L9qPTlRDYH8ustvpSgrGdqWJcj8qpZ.png?width=219" alt="TUNDRA TOYOTA" class="w-full h-32 object-contain mb-2" loading="lazy">
                        <!--[if ENDBLOCK]><![endif]-->
                        <h3 class="text-sm font-semibold">TUNDRA</h3>
                        <p class="text-xs text-gray-500">1999'den itibaren</p>
                    </div>
                </a>
            </div>
                        <div :class="{'hidden': 28 >= 10 &amp;&amp; !showAllModels}" class="hidden">
                <a href="https://aloparca.com/oto-yedek-parca/toyota/toyota-alphard" wire:navigate="" class="block" title="TOYOTA ALPHARD Yedek Parça">
                    <div class=" bg-gray-100 p-2 rounded-lg text-center hover:shadow-md transition duration-300">
                        <!--[if BLOCK]><![endif]-->                        <img src="https://bcdn.aloparca.com/car-images/BC8fyzAZKAYWZAitlCO79QoUGxtawwll2F0gZR1P.png?width=219" alt="ALPHARD TOYOTA" class="w-full h-32 object-contain mb-2" loading="lazy">
                        <!--[if ENDBLOCK]><![endif]-->
                        <h3 class="text-sm font-semibold">ALPHARD</h3>
                        <p class="text-xs text-gray-500">2003'den itibaren</p>
                    </div>
                </a>
            </div>
                        <div :class="{'hidden': 29 >= 10 &amp;&amp; !showAllModels}" class="hidden">
                <a href="https://aloparca.com/oto-yedek-parca/toyota/toyota-dyna" wire:navigate="" class="block" title="TOYOTA DYNA Yedek Parça">
                    <div class=" bg-gray-100 p-2 rounded-lg text-center hover:shadow-md transition duration-300">
                        <!--[if BLOCK]><![endif]-->                        <img src="https://bcdn.aloparca.com/car-images/Ufe61lPOK7L4NWHcmv5XqvCYdyftBbj1W67Pazgw.png?width=219" alt="DYNA TOYOTA" class="w-full h-32 object-contain mb-2" loading="lazy">
                        <!--[if ENDBLOCK]><![endif]-->
                        <h3 class="text-sm font-semibold">DYNA</h3>
                        <p class="text-xs text-gray-500">1977'den itibaren</p>
                    </div>
                </a>
            </div>
                        <div :class="{'hidden': 30 >= 10 &amp;&amp; !showAllModels}" class="hidden">
                <a href="https://aloparca.com/oto-yedek-parca/toyota/toyota-tacoma" wire:navigate="" class="block" title="TOYOTA TACOMA Yedek Parça">
                    <div class=" bg-gray-100 p-2 rounded-lg text-center hover:shadow-md transition duration-300">
                        <!--[if BLOCK]><![endif]-->                        <img src="https://bcdn.aloparca.com/car-images/C7sejq1y7FQ13qE6YBPX05SFRjr1p7w5qz4isfs9.png?width=219" alt="TACOMA TOYOTA" class="w-full h-32 object-contain mb-2" loading="lazy">
                        <!--[if ENDBLOCK]><![endif]-->
                        <h3 class="text-sm font-semibold">TACOMA</h3>
                        <p class="text-xs text-gray-500">1994'den itibaren</p>
                    </div>
                </a>
            </div>
                        <div :class="{'hidden': 31 >= 10 &amp;&amp; !showAllModels}" class="hidden">
                <a href="https://aloparca.com/oto-yedek-parca/toyota/toyota-altezza" wire:navigate="" class="block" title="TOYOTA ALTEZZA Yedek Parça">
                    <div class=" bg-gray-100 p-2 rounded-lg text-center hover:shadow-md transition duration-300">
                        <!--[if BLOCK]><![endif]-->                        <img src="https://bcdn.aloparca.com/car-images/fmKqnDHkPeFKA546udW1q0jfn5KYW7HkFhNaQIRB.png?width=219" alt="ALTEZZA TOYOTA" class="w-full h-32 object-contain mb-2" loading="lazy">
                        <!--[if ENDBLOCK]><![endif]-->
                        <h3 class="text-sm font-semibold">ALTEZZA</h3>
                        <p class="text-xs text-gray-500">1998'den itibaren</p>
                    </div>
                </a>
            </div>
                        <div :class="{'hidden': 32 >= 10 &amp;&amp; !showAllModels}" class="hidden">
                <a href="https://aloparca.com/oto-yedek-parca/toyota/toyota-mirai" wire:navigate="" class="block" title="TOYOTA MIRAI Yedek Parça">
                    <div class=" bg-gray-100 p-2 rounded-lg text-center hover:shadow-md transition duration-300">
                        <!--[if BLOCK]><![endif]-->                        <img src="https://bcdn.aloparca.com/car-images/Gy1jK2SA3E1kfM3UJX6LC2nIAvqEyfu0V6HBoVwL.png?width=219" alt="MIRAI TOYOTA" class="w-full h-32 object-contain mb-2" loading="lazy">
                        <!--[if ENDBLOCK]><![endif]-->
                        <h3 class="text-sm font-semibold">MIRAI</h3>
                        <p class="text-xs text-gray-500">2014'den itibaren</p>
                    </div>
                </a>
            </div>
                        <div :class="{'hidden': 33 >= 10 &amp;&amp; !showAllModels}" class="hidden">
                <a href="https://aloparca.com/oto-yedek-parca/toyota/toyota-venza" wire:navigate="" class="block" title="TOYOTA VENZA Yedek Parça">
                    <div class=" bg-gray-100 p-2 rounded-lg text-center hover:shadow-md transition duration-300">
                        <!--[if BLOCK]><![endif]-->                        <img src="https://bcdn.aloparca.com/car-images/QzqDmf3BoVtonnSmEXd79DhmSeXuF63iv2mkjzOJ.png?width=219" alt="VENZA TOYOTA" class="w-full h-32 object-contain mb-2" loading="lazy">
                        <!--[if ENDBLOCK]><![endif]-->
                        <h3 class="text-sm font-semibold">VENZA</h3>
                        <p class="text-xs text-gray-500">2008'den itibaren</p>
                    </div>
                </a>
            </div>
                        <div :class="{'hidden': 34 >= 10 &amp;&amp; !showAllModels}" class="hidden">
                <a href="https://aloparca.com/oto-yedek-parca/toyota/toyota-avalon" wire:navigate="" class="block" title="TOYOTA AVALON Yedek Parça">
                    <div class=" bg-gray-100 p-2 rounded-lg text-center hover:shadow-md transition duration-300">
                        <!--[if BLOCK]><![endif]-->                        <img src="https://bcdn.aloparca.com/car-images/lwzqm7lTZuXcdb5CMGnWN24URsBcFDysrMRA6QZe.png?width=219" alt="AVALON TOYOTA" class="w-full h-32 object-contain mb-2" loading="lazy">
                        <!--[if ENDBLOCK]><![endif]-->
                        <h3 class="text-sm font-semibold">AVALON</h3>
                        <p class="text-xs text-gray-500">1994'den itibaren</p>
                    </div>
                </a>
            </div>
                        <div :class="{'hidden': 35 >= 10 &amp;&amp; !showAllModels}" class="hidden">
                <a href="https://aloparca.com/oto-yedek-parca/toyota/toyota-fortuner" wire:navigate="" class="block" title="TOYOTA FORTUNER Yedek Parça">
                    <div class=" bg-gray-100 p-2 rounded-lg text-center hover:shadow-md transition duration-300">
                        <!--[if BLOCK]><![endif]-->                        <img src="https://bcdn.aloparca.com/car-images/DSPKYyPSlE3JvJa0toKiiaWnalhOgEPW8uqRXijf.png?width=219" alt="FORTUNER TOYOTA" class="w-full h-32 object-contain mb-2" loading="lazy">
                        <!--[if ENDBLOCK]><![endif]-->
                        <h3 class="text-sm font-semibold">FORTUNER</h3>
                        <p class="text-xs text-gray-500">2004'den itibaren</p>
                    </div>
                </a>
            </div>
                        <div :class="{'hidden': 36 >= 10 &amp;&amp; !showAllModels}" class="hidden">
                <a href="https://aloparca.com/oto-yedek-parca/toyota/toyota-tercel" wire:navigate="" class="block" title="TOYOTA TERCEL Yedek Parça">
                    <div class=" bg-gray-100 p-2 rounded-lg text-center hover:shadow-md transition duration-300">
                        <!--[if BLOCK]><![endif]-->                        <img src="https://bcdn.aloparca.com/car-images/eT5IIKVCTqgKHWb2wYA7bWW5mbHAIjzyXlnGOtZJ.png?width=219" alt="TERCEL TOYOTA" class="w-full h-32 object-contain mb-2" loading="lazy">
                        <!--[if ENDBLOCK]><![endif]-->
                        <h3 class="text-sm font-semibold">TERCEL</h3>
                        <p class="text-xs text-gray-500">1979'den itibaren</p>
                    </div>
                </a>
            </div>
                        <div :class="{'hidden': 37 >= 10 &amp;&amp; !showAllModels}" class="hidden">
                <a href="https://aloparca.com/oto-yedek-parca/toyota/toyota-liteace" wire:navigate="" class="block" title="TOYOTA LITEACE Yedek Parça">
                    <div class=" bg-gray-100 p-2 rounded-lg text-center hover:shadow-md transition duration-300">
                        <!--[if BLOCK]><![endif]-->                        <img src="https://bcdn.aloparca.com/car-images/WcS0CsUhU1jnYYkdo2uZpXM7udrKoWB7jVjQABQL.png?width=219" alt="LITEACE TOYOTA" class="w-full h-32 object-contain mb-2" loading="lazy">
                        <!--[if ENDBLOCK]><![endif]-->
                        <h3 class="text-sm font-semibold">LITEACE</h3>
                        <p class="text-xs text-gray-500">1979'den itibaren</p>
                    </div>
                </a>
            </div>
                        <div :class="{'hidden': 38 >= 10 &amp;&amp; !showAllModels}" class="hidden">
                <a href="https://aloparca.com/oto-yedek-parca/toyota/toyota-sequoia" wire:navigate="" class="block" title="TOYOTA SEQUOIA Yedek Parça">
                    <div class=" bg-gray-100 p-2 rounded-lg text-center hover:shadow-md transition duration-300">
                        <!--[if BLOCK]><![endif]-->                        <img src="https://bcdn.aloparca.com/car-images/gfCciNwdqF4pWhKfeAzZV57odjrTQnKGcfVwmqTe.png?width=219" alt="SEQUOIA TOYOTA" class="w-full h-32 object-contain mb-2" loading="lazy">
                        <!--[if ENDBLOCK]><![endif]-->
                        <h3 class="text-sm font-semibold">SEQUOIA</h3>
                        <p class="text-xs text-gray-500">2000'den itibaren</p>
                    </div>
                </a>
            </div>
                        <div :class="{'hidden': 39 >= 10 &amp;&amp; !showAllModels}" class="hidden">
                <a href="https://aloparca.com/oto-yedek-parca/toyota/toyota-century" wire:navigate="" class="block" title="TOYOTA CENTURY Yedek Parça">
                    <div class=" bg-gray-100 p-2 rounded-lg text-center hover:shadow-md transition duration-300">
                        <!--[if BLOCK]><![endif]-->                        <img src="https://bcdn.aloparca.com/car-images/oAlTtS8afGNQZbjw2tlTOSRScJbz893y0rVoiT8U.png?width=219" alt="CENTURY TOYOTA" class="w-full h-32 object-contain mb-2" loading="lazy">
                        <!--[if ENDBLOCK]><![endif]-->
                        <h3 class="text-sm font-semibold">CENTURY</h3>
                        <p class="text-xs text-gray-500">1997'den itibaren</p>
                    </div>
                </a>
            </div>
                        <div :class="{'hidden': 40 >= 10 &amp;&amp; !showAllModels}" class="hidden">
                <a href="https://aloparca.com/oto-yedek-parca/toyota/toyota-crown" wire:navigate="" class="block" title="TOYOTA CROWN Yedek Parça">
                    <div class=" bg-gray-100 p-2 rounded-lg text-center hover:shadow-md transition duration-300">
                        <!--[if BLOCK]><![endif]-->                        <img src="https://bcdn.aloparca.com/car-images/DPkOLWcWjTtnimN1rhMRmDe6a11SI7010dzaziF2.png?width=219" alt="CROWN TOYOTA" class="w-full h-32 object-contain mb-2" loading="lazy">
                        <!--[if ENDBLOCK]><![endif]-->
                        <h3 class="text-sm font-semibold">CROWN</h3>
                        <p class="text-xs text-gray-500">1980'den itibaren</p>
                    </div>
                </a>
            </div>
                        <div :class="{'hidden': 41 >= 10 &amp;&amp; !showAllModels}" class="hidden">
                <a href="https://aloparca.com/oto-yedek-parca/toyota/toyota-1000publica" wire:navigate="" class="block" title="TOYOTA 1000/Publica Yedek Parça">
                    <div class=" bg-gray-100 p-2 rounded-lg text-center hover:shadow-md transition duration-300">
                        <!--[if BLOCK]><![endif]-->                        <img src="https://bcdn.aloparca.com/car-images/F9Eg3hXSzLmmQehpIOTzsgtRrTuM41UMHZt6XL0o.png?width=219" alt="1000/Publica TOYOTA" class="w-full h-32 object-contain mb-2" loading="lazy">
                        <!--[if ENDBLOCK]><![endif]-->
                        <h3 class="text-sm font-semibold">1000/Publica</h3>
                        <p class="text-xs text-gray-500">1969'den itibaren</p>
                    </div>
                </a>
            </div>
                        <div :class="{'hidden': 42 >= 10 &amp;&amp; !showAllModels}" class="hidden">
                <a href="https://aloparca.com/oto-yedek-parca/toyota/toyota-corona" wire:navigate="" class="block" title="TOYOTA CORONA Yedek Parça">
                    <div class=" bg-gray-100 p-2 rounded-lg text-center hover:shadow-md transition duration-300">
                        <!--[if BLOCK]><![endif]-->                        <img src="https://bcdn.aloparca.com/car-images/YHVvs5jYNoqcQDr57VNxjBATh6Romcz52eoU2sZa.png?width=219" alt="CORONA TOYOTA" class="w-full h-32 object-contain mb-2" loading="lazy">
                        <!--[if ENDBLOCK]><![endif]-->
                        <h3 class="text-sm font-semibold">CORONA</h3>
                        <p class="text-xs text-gray-500">1970'den itibaren</p>
                    </div>
                </a>
            </div>
                        <div :class="{'hidden': 43 >= 10 &amp;&amp; !showAllModels}" class="hidden">
                <a href="https://aloparca.com/oto-yedek-parca/toyota/toyota-bb" wire:navigate="" class="block" title="TOYOTA bB Yedek Parça">
                    <div class=" bg-gray-100 p-2 rounded-lg text-center hover:shadow-md transition duration-300">
                        <!--[if BLOCK]><![endif]-->                        <img src="https://bcdn.aloparca.com/car-images/xgSEHe7uA0L5x6nfVKTUgN94F2HdpiVfe6KADVHl.png?width=219" alt="bB TOYOTA" class="w-full h-32 object-contain mb-2" loading="lazy">
                        <!--[if ENDBLOCK]><![endif]-->
                        <h3 class="text-sm font-semibold">bB</h3>
                        <p class="text-xs text-gray-500">2000'den itibaren</p>
                    </div>
                </a>
            </div>
                        <div :class="{'hidden': 44 >= 10 &amp;&amp; !showAllModels}" class="hidden">
                <a href="https://aloparca.com/oto-yedek-parca/toyota/toyota-matrix" wire:navigate="" class="block" title="TOYOTA MATRIX Yedek Parça">
                    <div class=" bg-gray-100 p-2 rounded-lg text-center hover:shadow-md transition duration-300">
                        <!--[if BLOCK]><![endif]-->                        <img src="https://bcdn.aloparca.com/car-images/KfEttjC2bAbuRFuWLfR0yeRHYJu52Kji68lQ3VaX.png?width=219" alt="MATRIX TOYOTA" class="w-full h-32 object-contain mb-2" loading="lazy">
                        <!--[if ENDBLOCK]><![endif]-->
                        <h3 class="text-sm font-semibold">MATRIX</h3>
                        <p class="text-xs text-gray-500">2002'den itibaren</p>
                    </div>
                </a>
            </div>
                        <div :class="{'hidden': 45 >= 10 &amp;&amp; !showAllModels}" class="hidden">
                <a href="https://aloparca.com/oto-yedek-parca/toyota/toyota-cressida" wire:navigate="" class="block" title="TOYOTA CRESSIDA Yedek Parça">
                    <div class=" bg-gray-100 p-2 rounded-lg text-center hover:shadow-md transition duration-300">
                        <!--[if BLOCK]><![endif]-->                        <img src="https://bcdn.aloparca.com/car-images/pTVhqd7zDOijZUhE7qIUST7lSvWXlJMBydbyMXDZ.png?width=219" alt="CRESSIDA TOYOTA" class="w-full h-32 object-contain mb-2" loading="lazy">
                        <!--[if ENDBLOCK]><![endif]-->
                        <h3 class="text-sm font-semibold">CRESSIDA</h3>
                        <p class="text-xs text-gray-500">1976'den itibaren</p>
                    </div>
                </a>
            </div>
                        <div :class="{'hidden': 46 >= 10 &amp;&amp; !showAllModels}" class="hidden">
                <a href="https://aloparca.com/oto-yedek-parca/toyota/toyota-solara" wire:navigate="" class="block" title="TOYOTA SOLARA Yedek Parça">
                    <div class=" bg-gray-100 p-2 rounded-lg text-center hover:shadow-md transition duration-300">
                        <!--[if BLOCK]><![endif]-->                        <img src="https://bcdn.aloparca.com/car-images/OYiJCXi0Vr4bTAuZsXASdHvhGEGltwvwwuCJsp7X.png?width=219" alt="SOLARA TOYOTA" class="w-full h-32 object-contain mb-2" loading="lazy">
                        <!--[if ENDBLOCK]><![endif]-->
                        <h3 class="text-sm font-semibold">SOLARA</h3>
                        <p class="text-xs text-gray-500">1998'den itibaren</p>
                    </div>
                </a>
            </div>
                        <div :class="{'hidden': 47 >= 10 &amp;&amp; !showAllModels}" class="hidden">
                <a href="https://aloparca.com/oto-yedek-parca/toyota/toyota-townace" wire:navigate="" class="block" title="TOYOTA TOWNACE Yedek Parça">
                    <div class=" bg-gray-100 p-2 rounded-lg text-center hover:shadow-md transition duration-300">
                        <!--[if BLOCK]><![endif]-->                        <img src="https://bcdn.aloparca.com/car-images/G5EtVVbXXGkhoZ0JMzG0OeqXg4ENP2E0bgVRBfEr.png?width=219" alt="TOWNACE TOYOTA" class="w-full h-32 object-contain mb-2" loading="lazy">
                        <!--[if ENDBLOCK]><![endif]-->
                        <h3 class="text-sm font-semibold">TOWNACE</h3>
                        <p class="text-xs text-gray-500">1992'den itibaren</p>
                    </div>
                </a>
            </div>
                        <div :class="{'hidden': 48 >= 10 &amp;&amp; !showAllModels}" class="hidden">
                <a href="https://aloparca.com/oto-yedek-parca/toyota/toyota-rush" wire:navigate="" class="block" title="TOYOTA RUSH Yedek Parça">
                    <div class=" bg-gray-100 p-2 rounded-lg text-center hover:shadow-md transition duration-300">
                        <!--[if BLOCK]><![endif]-->                        <img src="https://bcdn.aloparca.com/car-images/XVVKwYfXEXpsR8DQd2PNflZ1U3FJ0NZhKXOyaqCs.png?width=219" alt="RUSH TOYOTA" class="w-full h-32 object-contain mb-2" loading="lazy">
                        <!--[if ENDBLOCK]><![endif]-->
                        <h3 class="text-sm font-semibold">RUSH</h3>
                        <p class="text-xs text-gray-500">2006'den itibaren</p>
                    </div>
                </a>
            </div>
                        <div :class="{'hidden': 49 >= 10 &amp;&amp; !showAllModels}" class="hidden">
                <a href="https://aloparca.com/oto-yedek-parca/toyota/toyota-coaster" wire:navigate="" class="block" title="TOYOTA COASTER Yedek Parça">
                    <div class=" bg-gray-100 p-2 rounded-lg text-center hover:shadow-md transition duration-300">
                        <!--[if BLOCK]><![endif]-->                        <img src="https://bcdn.aloparca.com/car-images/KBB1EQ9XjnL0lgX5xdXYTi2yfHV36F1ValaXuQsG.png?width=219" alt="COASTER TOYOTA" class="w-full h-32 object-contain mb-2" loading="lazy">
                        <!--[if ENDBLOCK]><![endif]-->
                        <h3 class="text-sm font-semibold">COASTER</h3>
                        <p class="text-xs text-gray-500">1977'den itibaren</p>
                    </div>
                </a>
            </div>
                        <div :class="{'hidden': 50 >= 10 &amp;&amp; !showAllModels}" class="hidden">
                <a href="https://aloparca.com/oto-yedek-parca/toyota/toyota-wish" wire:navigate="" class="block" title="TOYOTA WISH Yedek Parça">
                    <div class=" bg-gray-100 p-2 rounded-lg text-center hover:shadow-md transition duration-300">
                        <!--[if BLOCK]><![endif]-->                        <img src="https://bcdn.aloparca.com/car-images/IpdEUWPvqFpdKenmvRKFozma9hSNqL9PxhSSohbt.png?width=219" alt="WISH TOYOTA" class="w-full h-32 object-contain mb-2" loading="lazy">
                        <!--[if ENDBLOCK]><![endif]-->
                        <h3 class="text-sm font-semibold">WISH</h3>
                        <p class="text-xs text-gray-500">2003'den itibaren</p>
                    </div>
                </a>
            </div>
                        <div :class="{'hidden': 51 >= 10 &amp;&amp; !showAllModels}" class="hidden">
                <a href="https://aloparca.com/oto-yedek-parca/toyota/toyota-echo" wire:navigate="" class="block" title="TOYOTA ECHO Yedek Parça">
                    <div class=" bg-gray-100 p-2 rounded-lg text-center hover:shadow-md transition duration-300">
                        <!--[if BLOCK]><![endif]-->                        <img src="https://bcdn.aloparca.com/car-images/rD7YHJsF8YZEzoQNo4kZwq8LHztlI0xptOIFsQSu.png?width=219" alt="ECHO TOYOTA" class="w-full h-32 object-contain mb-2" loading="lazy">
                        <!--[if ENDBLOCK]><![endif]-->
                        <h3 class="text-sm font-semibold">ECHO</h3>
                        <p class="text-xs text-gray-500">1999'den itibaren</p>
                    </div>
                </a>
            </div>
                        <div :class="{'hidden': 52 >= 10 &amp;&amp; !showAllModels}" class="hidden">
                <a href="https://aloparca.com/oto-yedek-parca/toyota/toyota-estima-emina-lucida" wire:navigate="" class="block" title="TOYOTA ESTIMA EMINA / LUCIDA Yedek Parça">
                    <div class=" bg-gray-100 p-2 rounded-lg text-center hover:shadow-md transition duration-300">
                        <!--[if BLOCK]><![endif]-->                        <img src="https://bcdn.aloparca.com/car-images/EpK2zblnuXkROHKApZZ3k4bUwc8lsdZCXwgRc9fe.png?width=219" alt="ESTIMA EMINA / LUCIDA TOYOTA" class="w-full h-32 object-contain mb-2" loading="lazy">
                        <!--[if ENDBLOCK]><![endif]-->
                        <h3 class="text-sm font-semibold">ESTIMA EMINA / LUCIDA</h3>
                        <p class="text-xs text-gray-500">1990'den itibaren</p>
                    </div>
                </a>
            </div>
                        <div :class="{'hidden': 53 >= 10 &amp;&amp; !showAllModels}" class="hidden">
                <a href="https://aloparca.com/oto-yedek-parca/toyota/toyota-aurion" wire:navigate="" class="block" title="TOYOTA AURION Yedek Parça">
                    <div class=" bg-gray-100 p-2 rounded-lg text-center hover:shadow-md transition duration-300">
                        <!--[if BLOCK]><![endif]-->                        <img src="https://bcdn.aloparca.com/car-images/bovwfQzZGM4toamnWXvSxxWje83ojThZqG0Q45St.png?width=219" alt="AURION TOYOTA" class="w-full h-32 object-contain mb-2" loading="lazy">
                        <!--[if ENDBLOCK]><![endif]-->
                        <h3 class="text-sm font-semibold">AURION</h3>
                        <p class="text-xs text-gray-500">2011'den itibaren</p>
                    </div>
                </a>
            </div>
                        <div :class="{'hidden': 54 >= 10 &amp;&amp; !showAllModels}" class="hidden">
                <a href="https://aloparca.com/oto-yedek-parca/toyota/toyota-sienta" wire:navigate="" class="block" title="TOYOTA SIENTA Yedek Parça">
                    <div class=" bg-gray-100 p-2 rounded-lg text-center hover:shadow-md transition duration-300">
                        <!--[if BLOCK]><![endif]-->                        <img src="https://bcdn.aloparca.com/car-images/o3KGCL26mN9JFSSqKvSKf8rsfJrCBsOfQNIsTCsa.png?width=219" alt="SIENTA TOYOTA" class="w-full h-32 object-contain mb-2" loading="lazy">
                        <!--[if ENDBLOCK]><![endif]-->
                        <h3 class="text-sm font-semibold">SIENTA</h3>
                        <p class="text-xs text-gray-500">2015'den itibaren</p>
                    </div>
                </a>
            </div>
                        <div :class="{'hidden': 55 >= 10 &amp;&amp; !showAllModels}" class="hidden">
                <a href="https://aloparca.com/oto-yedek-parca/toyota/toyota-granvia" wire:navigate="" class="block" title="TOYOTA GRANVIA Yedek Parça">
                    <div class=" bg-gray-100 p-2 rounded-lg text-center hover:shadow-md transition duration-300">
                        <!--[if BLOCK]><![endif]-->                        <img src="https://bcdn.aloparca.com/car-images/xdjexEozBwKAv2CpCYJKDeDVNb8IToXW5TqXasZL.png?width=219" alt="GRANVIA TOYOTA" class="w-full h-32 object-contain mb-2" loading="lazy">
                        <!--[if ENDBLOCK]><![endif]-->
                        <h3 class="text-sm font-semibold">GRANVIA</h3>
                        <p class="text-xs text-gray-500">1995'den itibaren</p>
                    </div>
                </a>
            </div>
                        <div :class="{'hidden': 56 >= 10 &amp;&amp; !showAllModels}" class="hidden">
                <a href="https://aloparca.com/oto-yedek-parca/toyota/toyota-harrier" wire:navigate="" class="block" title="TOYOTA HARRIER Yedek Parça">
                    <div class=" bg-gray-100 p-2 rounded-lg text-center hover:shadow-md transition duration-300">
                        <!--[if BLOCK]><![endif]-->                        <img src="https://bcdn.aloparca.com/car-images/X408proFCMqLfzzYwn5N9uihsUqbATKZkApAW5lQ.png?width=219" alt="HARRIER TOYOTA" class="w-full h-32 object-contain mb-2" loading="lazy">
                        <!--[if ENDBLOCK]><![endif]-->
                        <h3 class="text-sm font-semibold">HARRIER</h3>
                        <p class="text-xs text-gray-500">1997'den itibaren</p>
                    </div>
                </a>
            </div>
                        <div :class="{'hidden': 57 >= 10 &amp;&amp; !showAllModels}" class="hidden">
                <a href="https://aloparca.com/oto-yedek-parca/toyota/toyota-sprinter" wire:navigate="" class="block" title="TOYOTA SPRINTER Yedek Parça">
                    <div class=" bg-gray-100 p-2 rounded-lg text-center hover:shadow-md transition duration-300">
                        <!--[if BLOCK]><![endif]-->                        <img src="https://bcdn.aloparca.com/car-images/yBCy8aFh3oLt1GAykBsfM4Vzmn3Njy2IFA7s35QA.png?width=219" alt="SPRINTER TOYOTA" class="w-full h-32 object-contain mb-2" loading="lazy">
                        <!--[if ENDBLOCK]><![endif]-->
                        <h3 class="text-sm font-semibold">SPRINTER</h3>
                        <p class="text-xs text-gray-500">1983'den itibaren</p>
                    </div>
                </a>
            </div>
                        <div :class="{'hidden': 58 >= 10 &amp;&amp; !showAllModels}" class="hidden">
                <a href="https://aloparca.com/oto-yedek-parca/toyota/toyota-avanza" wire:navigate="" class="block" title="TOYOTA AVANZA Yedek Parça">
                    <div class=" bg-gray-100 p-2 rounded-lg text-center hover:shadow-md transition duration-300">
                        <!--[if BLOCK]><![endif]-->                        <img src="https://bcdn.aloparca.com/car-images/u8A4Faw6KUxdem73aKeVGkVUUxm8gsiXGwcWUvWH.png?width=219" alt="AVANZA TOYOTA" class="w-full h-32 object-contain mb-2" loading="lazy">
                        <!--[if ENDBLOCK]><![endif]-->
                        <h3 class="text-sm font-semibold">AVANZA</h3>
                        <p class="text-xs text-gray-500">2003'den itibaren</p>
                    </div>
                </a>
            </div>
                        <div :class="{'hidden': 59 >= 10 &amp;&amp; !showAllModels}" class="hidden">
                <a href="https://aloparca.com/oto-yedek-parca/toyota/toyota-vista" wire:navigate="" class="block" title="TOYOTA VISTA Yedek Parça">
                    <div class=" bg-gray-100 p-2 rounded-lg text-center hover:shadow-md transition duration-300">
                        <!--[if BLOCK]><![endif]-->                        <img src="https://bcdn.aloparca.com/car-images/q2Te45AIQxLpkVp6U2JWiePtHBWKaLrQGDJ7EsJJ.png?width=219" alt="VISTA TOYOTA" class="w-full h-32 object-contain mb-2" loading="lazy">
                        <!--[if ENDBLOCK]><![endif]-->
                        <h3 class="text-sm font-semibold">VISTA</h3>
                        <p class="text-xs text-gray-500">1990'den itibaren</p>
                    </div>
                </a>
            </div>
                        <div :class="{'hidden': 60 >= 10 &amp;&amp; !showAllModels}" class="hidden">
                <a href="https://aloparca.com/oto-yedek-parca/toyota/toyota-probox" wire:navigate="" class="block" title="TOYOTA PROBOX Yedek Parça">
                    <div class=" bg-gray-100 p-2 rounded-lg text-center hover:shadow-md transition duration-300">
                        <!--[if BLOCK]><![endif]-->                        <img src="https://bcdn.aloparca.com/car-images/dGZJh2PyGdAekYHqyeyPHupgHz8qjdH7fMJPDMkE.png?width=219" alt="PROBOX TOYOTA" class="w-full h-32 object-contain mb-2" loading="lazy">
                        <!--[if ENDBLOCK]><![endif]-->
                        <h3 class="text-sm font-semibold">PROBOX</h3>
                        <p class="text-xs text-gray-500">2014'den itibaren</p>
                    </div>
                </a>
            </div>
            <!--[if ENDBLOCK]><![endif]-->
        </div>

        <!--[if BLOCK]><![endif]-->        <div class="mt-4 text-center">
            <button x-show="!showAllModels" @click="showAllModels = true" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Daha Fazla TOYOTA Modeli Göster
            </button>
            <button x-show="showAllModels" @click="showAllModels = false" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" style="display: none;">
                Daha Az Göster
            </button>
        </div>
        <!--[if ENDBLOCK]><![endif]-->
    </div>
     """


# Supposons que `html` contient le code HTML extrait
soup = BeautifulSoup(html, 'html.parser')

# Extraction du titre principal
title_element = soup.find("h2", class_="text-xl font-bold")
main_title = title_element.text.strip() if title_element else "Titre non trouvé"

# Initialisation des données
data = {"title": main_title, "models": []}

# Recherche des modèles
model_divs = soup.find_all("div", class_="bg-gray-100 p-2 rounded-lg text-center hover:shadow-md transition duration-300")

for model_div in model_divs:
    model_name = model_div.find("h3").text.strip()
    model_image = model_div.find("img")["src"]

    data["models"].append({
        "name": model_name,
        "image": model_image
    })

# Enregistrement des données dans un fichier JSON
with open("ToyotaModels.json", "w", encoding="utf-8") as file:
    json.dump(data, file, indent=4, ensure_ascii=False)

print("Les données ont été enregistrées dans models.json")
