from bs4 import BeautifulSoup
import json
from deep_translator import GoogleTranslator


# Remplace ça par ton HTML complet
html = """<div class="hidden md:block w-1/4 pr-4 mb-4">
            <!-- resources/views/components/category-sidebar.blade.php -->
<div class="bg-white shadow-md rounded-lg overflow-hidden">
    <h2 class="text-xl font-bold p-4 border-b"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">Categories</font></font></h2>
    <!--[if BLOCK]><![endif]-->    <ul x-data="{ 
            openCategories: {
                                    'filtreler': true,
                                    'yaglar-ve-sivilar': false,
                                    'fren': false,
                                    'suspansiyon': false,
                                    'triger-zincir-ve-rulman': false,
                                    'yakit-sistemi': false,
                                    'aydinlatma': false,
                                    'motor': false,
                                    'direksiyon': false,
                                    'dis-kaporta-aksami': false,
                                    'sogutma': false,
                                    'elektrik': false,
                            } 
        }">
        <!--[if BLOCK]><![endif]-->        <li class="border-b last:border-b-0">
            <div class="flex items-center justify-between px-4 py-2 hover:bg-gray-100 cursor-pointer bg-orange-100" @click="openCategories['filtreler'] = !openCategories['filtreler']">
                <div class="flex items-center">
                                        <!--[if BLOCK]><![endif]-->                    <img src="https://bcdn.aloparca.com/category/image/10105.png?width=32" alt="Filters" class="w-8 h-8 object-cover rounded-full mr-2" loading="lazy">
                    <!--[if ENDBLOCK]><![endif]-->
                    <span><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">Filters</font></font></span>
                </div>
                <!--[if BLOCK]><![endif]-->                <svg class="w-4 h-4 transform transition-transform" :class="{'rotate-180': openCategories['filtreler']}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                </svg>
                <!--[if ENDBLOCK]><![endif]-->
            </div>
            <!--[if BLOCK]><![endif]-->            <div x-show="openCategories['filtreler']" x-collapse="" style="height: 0px; overflow: hidden; display: none;" hidden="">
                <ul class="ml-4">
                    <!--[if BLOCK]><![endif]-->                    <li>
                        <a href="https://aloparca.com/yedek-parcalar/audi/audi-a6/audi-a6-c8-sedan-4a2-022018/audi-a6-s6-tdi-mild-hybrid-quattro-253-kw-344-ps-012021/kategori/filtreler/hava-filtresi" class="block px-4 py-2 hover:bg-gray-100 relative " wire:navigate.hover="">
                            <div class="flex items-center">
                                <!--[if BLOCK]><![endif]-->                                <img src="https://bcdn.aloparca.com/subcategory/images/hava-filtresi.png?width=24" alt="Hava Filtresi" class="w-6 h-6 object-cover rounded-full mr-2" loading="lazy">
                                <!--[if ENDBLOCK]><![endif]-->
                                <span>Hava Filtresi</span>
                            </div>
                        </a>
                    </li>
                                        <li>
                        <a href="https://aloparca.com/yedek-parcalar/audi/audi-a6/audi-a6-c8-sedan-4a2-022018/audi-a6-s6-tdi-mild-hybrid-quattro-253-kw-344-ps-012021/kategori/filtreler/polen-filtresi" class="block px-4 py-2 hover:bg-gray-100 relative " wire:navigate.hover="">
                            <div class="flex items-center">
                                <!--[if BLOCK]><![endif]-->                                <img src="https://bcdn.aloparca.com/subcategory/images/polen-filtresi.jpg?width=24" alt="Polen Filtresi" class="w-6 h-6 object-cover rounded-full mr-2" loading="lazy">
                                <!--[if ENDBLOCK]><![endif]-->
                                <span>Polen Filtresi</span>
                            </div>
                        </a>
                    </li>
                                        <li>
                        <a href="https://aloparca.com/yedek-parcalar/audi/audi-a6/audi-a6-c8-sedan-4a2-022018/audi-a6-s6-tdi-mild-hybrid-quattro-253-kw-344-ps-012021/kategori/filtreler/yag-filtresi" class="block px-4 py-2 hover:bg-gray-100 relative " wire:navigate.hover="">
                            <div class="flex items-center">
                                <!--[if BLOCK]><![endif]-->                                <img src="https://bcdn.aloparca.com/subcategory/images/yag-filtresi.png?width=24" alt="Yağ Filtresi" class="w-6 h-6 object-cover rounded-full mr-2" loading="lazy">
                                <!--[if ENDBLOCK]><![endif]-->
                                <span>Yağ Filtresi</span>
                            </div>
                        </a>
                    </li>
                                        <li>
                        <a href="https://aloparca.com/yedek-parcalar/audi/audi-a6/audi-a6-c8-sedan-4a2-022018/audi-a6-s6-tdi-mild-hybrid-quattro-253-kw-344-ps-012021/kategori/filtreler/yakit-filtresi" class="block px-4 py-2 hover:bg-gray-100 relative " wire:navigate.hover="">
                            <div class="flex items-center">
                                <!--[if BLOCK]><![endif]-->                                <img src="https://bcdn.aloparca.com/subcategory/images/yakit-filtresi.png?width=24" alt="Yakıt Filtresi" class="w-6 h-6 object-cover rounded-full mr-2" loading="lazy">
                                <!--[if ENDBLOCK]><![endif]-->
                                <span>Yakıt Filtresi</span>
                            </div>
                        </a>
                    </li>
                                        <li>
                        <a href="https://aloparca.com/yedek-parcalar/audi/audi-a6/audi-a6-c8-sedan-4a2-022018/audi-a6-s6-tdi-mild-hybrid-quattro-253-kw-344-ps-012021/kategori/filtreler/karter-tapasi" class="block px-4 py-2 hover:bg-gray-100 relative " wire:navigate.hover="">
                            <div class="flex items-center">
                                <!--[if BLOCK]><![endif]-->                                <div class="w-6 h-6 bg-gray-200 rounded-full mr-2 flex items-center justify-center">
                                    <span class="text-xs text-gray-500">K</span>
                                </div>
                                <!--[if ENDBLOCK]><![endif]-->
                                <span>Karter Tapası</span>
                            </div>
                        </a>
                    </li>
                    <!--[if ENDBLOCK]><![endif]-->
                </ul>
            </div>
            <!--[if ENDBLOCK]><![endif]-->
        </li>
                <li class="border-b last:border-b-0">
            <div class="flex items-center justify-between px-4 py-2 hover:bg-gray-100 cursor-pointer " @click="openCategories['yaglar-ve-sivilar'] = !openCategories['yaglar-ve-sivilar']">
                <div class="flex items-center">
                                        <!--[if BLOCK]><![endif]-->                    <img src="https://bcdn.aloparca.com/category/image/01J7ATK5G0KQF8RVWG7NZ4YR76.png?width=32" alt="Oils and Liquids" class="w-8 h-8 object-cover rounded-full mr-2" loading="lazy">
                    <!--[if ENDBLOCK]><![endif]-->
                    <span><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">Oils and Liquids</font></font></span>
                </div>
                <!--[if BLOCK]><![endif]-->                <svg class="w-4 h-4 transform transition-transform rotate-180" :class="{'rotate-180': openCategories['yaglar-ve-sivilar']}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                </svg>
                <!--[if ENDBLOCK]><![endif]-->
            </div>
            <!--[if BLOCK]><![endif]-->            <div x-show="openCategories['yaglar-ve-sivilar']" x-collapse="" style="height: auto;">
                <ul class="ml-4">
                    <!--[if BLOCK]><![endif]-->                    <li>
                        <a href="https://aloparca.com/yedek-parcalar/audi/audi-a6/audi-a6-c8-sedan-4a2-022018/audi-a6-s6-tdi-mild-hybrid-quattro-253-kw-344-ps-012021/kategori/yaglar-ve-sivilar/motor-yag" class="block px-4 py-2 hover:bg-gray-100 relative " wire:navigate.hover="">
                            <div class="flex items-center">
                                <!--[if BLOCK]><![endif]-->                                <div class="w-6 h-6 bg-gray-200 rounded-full mr-2 flex items-center justify-center">
                                    <span class="text-xs text-gray-500"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">M</font></font></span>
                                </div>
                                <!--[if ENDBLOCK]><![endif]-->
                                <span><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">Engine Oil</font></font></span>
                            </div>
                        </a>
                    </li>
                    <!--[if ENDBLOCK]><![endif]-->
                </ul>
            </div>
            <!--[if ENDBLOCK]><![endif]-->
        </li>
                <li class="border-b last:border-b-0">
            <div class="flex items-center justify-between px-4 py-2 hover:bg-gray-100 cursor-pointer " @click="openCategories['fren'] = !openCategories['fren']">
                <div class="flex items-center">
                                        <!--[if BLOCK]><![endif]-->                    <img src="https://bcdn.aloparca.com/category/image/10106.png?width=32" alt="Brake" class="w-8 h-8 object-cover rounded-full mr-2" loading="lazy">
                    <!--[if ENDBLOCK]><![endif]-->
                    <span><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">Brake</font></font></span>
                </div>
                <!--[if BLOCK]><![endif]-->                <svg class="w-4 h-4 transform transition-transform" :class="{'rotate-180': openCategories['fren']}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                </svg>
                <!--[if ENDBLOCK]><![endif]-->
            </div>
            <!--[if BLOCK]><![endif]-->            <div x-show="openCategories['fren']" x-collapse="" style="display: none; height: 0px; overflow: hidden;" hidden="">
                <ul class="ml-4">
                    <!--[if BLOCK]><![endif]-->                    <li>
                        <a href="https://aloparca.com/yedek-parcalar/audi/audi-a6/audi-a6-c8-sedan-4a2-022018/audi-a6-s6-tdi-mild-hybrid-quattro-253-kw-344-ps-012021/kategori/fren/fren-disk" class="block px-4 py-2 hover:bg-gray-100 relative " wire:navigate.hover="">
                            <div class="flex items-center">
                                <!--[if BLOCK]><![endif]-->                                <img src="https://bcdn.aloparca.com/subcategory/images/fren-disk-ayna.png?width=24" alt="Fren Disk" class="w-6 h-6 object-cover rounded-full mr-2" loading="lazy">
                                <!--[if ENDBLOCK]><![endif]-->
                                <span>Fren Disk</span>
                            </div>
                        </a>
                    </li>
                                        <li>
                        <a href="https://aloparca.com/yedek-parcalar/audi/audi-a6/audi-a6-c8-sedan-4a2-022018/audi-a6-s6-tdi-mild-hybrid-quattro-253-kw-344-ps-012021/kategori/fren/fren-balatasi" class="block px-4 py-2 hover:bg-gray-100 relative " wire:navigate.hover="">
                            <div class="flex items-center">
                                <!--[if BLOCK]><![endif]-->                                <img src="https://bcdn.aloparca.com/subcategory/images/fren-disk-balata.png?width=24" alt="Fren Balatası" class="w-6 h-6 object-cover rounded-full mr-2" loading="lazy">
                                <!--[if ENDBLOCK]><![endif]-->
                                <span>Fren Balatası</span>
                            </div>
                        </a>
                    </li>
                                        <li>
                        <a href="https://aloparca.com/yedek-parcalar/audi/audi-a6/audi-a6-c8-sedan-4a2-022018/audi-a6-s6-tdi-mild-hybrid-quattro-253-kw-344-ps-012021/kategori/fren/balata-ikaz-kablosu" class="block px-4 py-2 hover:bg-gray-100 relative " wire:navigate.hover="">
                            <div class="flex items-center">
                                <!--[if BLOCK]><![endif]-->                                <img src="https://bcdn.aloparca.com/subcategory/images/balata-ikaz-kablosu.jpg?width=24" alt="Balata İkaz Kablosu" class="w-6 h-6 object-cover rounded-full mr-2" loading="lazy">
                                <!--[if ENDBLOCK]><![endif]-->
                                <span>Balata İkaz Kablosu</span>
                            </div>
                        </a>
                    </li>
                                        <li>
                        <a href="https://aloparca.com/yedek-parcalar/audi/audi-a6/audi-a6-c8-sedan-4a2-022018/audi-a6-s6-tdi-mild-hybrid-quattro-253-kw-344-ps-012021/kategori/fren/abs-sensoru" class="block px-4 py-2 hover:bg-gray-100 relative " wire:navigate.hover="">
                            <div class="flex items-center">
                                <!--[if BLOCK]><![endif]-->                                <img src="https://bcdn.aloparca.com/subcategory/images/abs-sensoru.png?width=24" alt="Abs Sensörü" class="w-6 h-6 object-cover rounded-full mr-2" loading="lazy">
                                <!--[if ENDBLOCK]><![endif]-->
                                <span>Abs Sensörü</span>
                            </div>
                        </a>
                    </li>
                                        <li>
                        <a href="https://aloparca.com/yedek-parcalar/audi/audi-a6/audi-a6-c8-sedan-4a2-022018/audi-a6-s6-tdi-mild-hybrid-quattro-253-kw-344-ps-012021/kategori/fren/fren-hortumu" class="block px-4 py-2 hover:bg-gray-100 relative " wire:navigate.hover="">
                            <div class="flex items-center">
                                <!--[if BLOCK]><![endif]-->                                <img src="https://bcdn.aloparca.com/subcategory/images/fren-hortumu.jpg?width=24" alt="Fren Hortumu" class="w-6 h-6 object-cover rounded-full mr-2" loading="lazy">
                                <!--[if ENDBLOCK]><![endif]-->
                                <span>Fren Hortumu</span>
                            </div>
                        </a>
                    </li>
                                        <li>
                        <a href="https://aloparca.com/yedek-parcalar/audi/audi-a6/audi-a6-c8-sedan-4a2-022018/audi-a6-s6-tdi-mild-hybrid-quattro-253-kw-344-ps-012021/kategori/fren/lastik-basinc-sensoru" class="block px-4 py-2 hover:bg-gray-100 relative " wire:navigate.hover="">
                            <div class="flex items-center">
                                <!--[if BLOCK]><![endif]-->                                <img src="https://bcdn.aloparca.com/subcategory/images/lastik-basinc-sensoru.jpg?width=24" alt="Lastik Basınç Sensörü" class="w-6 h-6 object-cover rounded-full mr-2" loading="lazy">
                                <!--[if ENDBLOCK]><![endif]-->
                                <span>Lastik Basınç Sensörü</span>
                            </div>
                        </a>
                    </li>
                    <!--[if ENDBLOCK]><![endif]-->
                </ul>
            </div>
            <!--[if ENDBLOCK]><![endif]-->
        </li>
                <li class="border-b last:border-b-0">
            <div class="flex items-center justify-between px-4 py-2 hover:bg-gray-100 cursor-pointer " @click="openCategories['suspansiyon'] = !openCategories['suspansiyon']">
                <div class="flex items-center">
                                        <!--[if BLOCK]><![endif]-->                    <img src="https://bcdn.aloparca.com/category/image/10111.png?width=32" alt="Suspension" class="w-8 h-8 object-cover rounded-full mr-2" loading="lazy">
                    <!--[if ENDBLOCK]><![endif]-->
                    <span><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">Suspension</font></font></span>
                </div>
                <!--[if BLOCK]><![endif]-->                <svg class="w-4 h-4 transform transition-transform rotate-180" :class="{'rotate-180': openCategories['suspansiyon']}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                </svg>
                <!--[if ENDBLOCK]><![endif]-->
            </div>
            <!--[if BLOCK]><![endif]-->            <div x-show="openCategories['suspansiyon']" x-collapse="" style="height: auto;">
                <ul class="ml-4">
                    <!--[if BLOCK]><![endif]-->                    <li>
                        <a href="https://aloparca.com/yedek-parcalar/audi/audi-a6/audi-a6-c8-sedan-4a2-022018/audi-a6-s6-tdi-mild-hybrid-quattro-253-kw-344-ps-012021/kategori/suspansiyon/amortisor" class="block px-4 py-2 hover:bg-gray-100 relative " wire:navigate.hover="">
                            <div class="flex items-center">
                                <!--[if BLOCK]><![endif]-->                                <img src="https://bcdn.aloparca.com/subcategory/images/amortisor.png?width=24" alt="Shock absorber" class="w-6 h-6 object-cover rounded-full mr-2" loading="lazy">
                                <!--[if ENDBLOCK]><![endif]-->
                                <span><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">Shock absorber</font></font></span>
                            </div>
                        </a>
                    </li>
                                        <li>
                        <a href="https://aloparca.com/yedek-parcalar/audi/audi-a6/audi-a6-c8-sedan-4a2-022018/audi-a6-s6-tdi-mild-hybrid-quattro-253-kw-344-ps-012021/kategori/suspansiyon/amortisor-takozu-ve-rulmani" class="block px-4 py-2 hover:bg-gray-100 relative " wire:navigate.hover="">
                            <div class="flex items-center">
                                <!--[if BLOCK]><![endif]-->                                <div class="w-6 h-6 bg-gray-200 rounded-full mr-2 flex items-center justify-center">
                                    <span class="text-xs text-gray-500"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">A</font></font></span>
                                </div>
                                <!--[if ENDBLOCK]><![endif]-->
                                <span><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">Shock Absorber Mounting and Bearing</font></font></span>
                            </div>
                        </a>
                    </li>
                                        <li>
                        <a href="https://aloparca.com/yedek-parcalar/audi/audi-a6/audi-a6-c8-sedan-4a2-022018/audi-a6-s6-tdi-mild-hybrid-quattro-253-kw-344-ps-012021/kategori/suspansiyon/amortisor-korugu-ve-darbe-emici" class="block px-4 py-2 hover:bg-gray-100 relative " wire:navigate.hover="">
                            <div class="flex items-center">
                                <!--[if BLOCK]><![endif]-->                                <div class="w-6 h-6 bg-gray-200 rounded-full mr-2 flex items-center justify-center">
                                    <span class="text-xs text-gray-500"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">A</font></font></span>
                                </div>
                                <!--[if ENDBLOCK]><![endif]-->
                                <span><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">Shock Absorber Bellows and Shock Absorber</font></font></span>
                            </div>
                        </a>
                    </li>
                                        <li>
                        <a href="https://aloparca.com/yedek-parcalar/audi/audi-a6/audi-a6-c8-sedan-4a2-022018/audi-a6-s6-tdi-mild-hybrid-quattro-253-kw-344-ps-012021/kategori/suspansiyon/viraj-demir-lastigi" class="block px-4 py-2 hover:bg-gray-100 relative " wire:navigate.hover="">
                            <div class="flex items-center">
                                <!--[if BLOCK]><![endif]-->                                <img src="https://bcdn.aloparca.com/subcategory/images/viraj-demir-lastigi.jpg?width=24" alt="Curve Iron Tire" class="w-6 h-6 object-cover rounded-full mr-2" loading="lazy">
                                <!--[if ENDBLOCK]><![endif]-->
                                <span><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">Curve Iron Tire</font></font></span>
                            </div>
                        </a>
                    </li>
                                        <li>
                        <a href="https://aloparca.com/yedek-parcalar/audi/audi-a6/audi-a6-c8-sedan-4a2-022018/audi-a6-s6-tdi-mild-hybrid-quattro-253-kw-344-ps-012021/kategori/suspansiyon/travers-torsiyon-takoz-burc" class="block px-4 py-2 hover:bg-gray-100 relative " wire:navigate.hover="">
                            <div class="flex items-center">
                                <!--[if BLOCK]><![endif]-->                                <div class="w-6 h-6 bg-gray-200 rounded-full mr-2 flex items-center justify-center">
                                    <span class="text-xs text-gray-500"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">T</font></font></span>
                                </div>
                                <!--[if ENDBLOCK]><![endif]-->
                                <span><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">Traverse Torsion Wedge Bushing</font></font></span>
                            </div>
                        </a>
                    </li>
                                        <li>
                        <a href="https://aloparca.com/yedek-parcalar/audi/audi-a6/audi-a6-c8-sedan-4a2-022018/audi-a6-s6-tdi-mild-hybrid-quattro-253-kw-344-ps-012021/kategori/suspansiyon/rot-basi" class="block px-4 py-2 hover:bg-gray-100 relative " wire:navigate.hover="">
                            <div class="flex items-center">
                                <!--[if BLOCK]><![endif]-->                                <img src="https://bcdn.aloparca.com/subcategory/images/rot-basi.png?width=24" alt="Tie Rod End" class="w-6 h-6 object-cover rounded-full mr-2" loading="lazy">
                                <!--[if ENDBLOCK]><![endif]-->
                                <span><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">Tie Rod End</font></font></span>
                            </div>
                        </a>
                    </li>
                                        <li>
                        <a href="https://aloparca.com/yedek-parcalar/audi/audi-a6/audi-a6-c8-sedan-4a2-022018/audi-a6-s6-tdi-mild-hybrid-quattro-253-kw-344-ps-012021/kategori/suspansiyon/rotil-ve-rotilli-kol" class="block px-4 py-2 hover:bg-gray-100 relative " wire:navigate.hover="">
                            <div class="flex items-center">
                                <!--[if BLOCK]><![endif]-->                                <img src="https://bcdn.aloparca.com/subcategory/images/rotil-ve-rotilli-kol.jpg?width=24" alt="Ball Joint and Ball Joint Arm" class="w-6 h-6 object-cover rounded-full mr-2" loading="lazy">
                                <!--[if ENDBLOCK]><![endif]-->
                                <span><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">Ball Joint and Ball Joint Arm</font></font></span>
                            </div>
                        </a>
                    </li>
                                        <li>
                        <a href="https://aloparca.com/yedek-parcalar/audi/audi-a6/audi-a6-c8-sedan-4a2-022018/audi-a6-s6-tdi-mild-hybrid-quattro-253-kw-344-ps-012021/kategori/suspansiyon/salincak-burcu" class="block px-4 py-2 hover:bg-gray-100 relative " wire:navigate.hover="">
                            <div class="flex items-center">
                                <!--[if BLOCK]><![endif]-->                                <img src="https://bcdn.aloparca.com/subcategory/images/salincak-burcu.jpg?width=24" alt="Swing Sign" class="w-6 h-6 object-cover rounded-full mr-2" loading="lazy">
                                <!--[if ENDBLOCK]><![endif]-->
                                <span><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">Swing Sign</font></font></span>
                            </div>
                        </a>
                    </li>
                                        <li>
                        <a href="https://aloparca.com/yedek-parcalar/audi/audi-a6/audi-a6-c8-sedan-4a2-022018/audi-a6-s6-tdi-mild-hybrid-quattro-253-kw-344-ps-012021/kategori/suspansiyon/porya-ve-rulman" class="block px-4 py-2 hover:bg-gray-100 relative " wire:navigate.hover="">
                            <div class="flex items-center">
                                <!--[if BLOCK]><![endif]-->                                <img src="https://bcdn.aloparca.com/subcategory/images/porya-rulmani.jpg?width=24" alt="Hub and Bearing" class="w-6 h-6 object-cover rounded-full mr-2" loading="lazy">
                                <!--[if ENDBLOCK]><![endif]-->
                                <span><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">Hub and Bearing</font></font></span>
                            </div>
                        </a>
                    </li>
                                        <li>
                        <a href="https://aloparca.com/yedek-parcalar/audi/audi-a6/audi-a6-c8-sedan-4a2-022018/audi-a6-s6-tdi-mild-hybrid-quattro-253-kw-344-ps-012021/kategori/suspansiyon/denge-kolu" class="block px-4 py-2 hover:bg-gray-100 relative " wire:navigate.hover="">
                            <div class="flex items-center">
                                <!--[if BLOCK]><![endif]-->                                <img src="https://bcdn.aloparca.com/subcategory/images/denge-kolu.jpg?width=24" alt="Balance Arm" class="w-6 h-6 object-cover rounded-full mr-2" loading="lazy">
                                <!--[if ENDBLOCK]><![endif]-->
                                <span><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">Balance Arm</font></font></span>
                            </div>
                        </a>
                    </li>
                                        <li>
                        <a href="https://aloparca.com/yedek-parcalar/audi/audi-a6/audi-a6-c8-sedan-4a2-022018/audi-a6-s6-tdi-mild-hybrid-quattro-253-kw-344-ps-012021/kategori/suspansiyon/salincak" class="block px-4 py-2 hover:bg-gray-100 relative " wire:navigate.hover="">
                            <div class="flex items-center">
                                <!--[if BLOCK]><![endif]-->                                <img src="https://bcdn.aloparca.com/subcategory/images/salincak.png?width=24" alt="Swing" class="w-6 h-6 object-cover rounded-full mr-2" loading="lazy">
                                <!--[if ENDBLOCK]><![endif]-->
                                <span><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">Swing</font></font></span>
                            </div>
                        </a>
                    </li>
                                        <li>
                        <a href="https://aloparca.com/yedek-parcalar/audi/audi-a6/audi-a6-c8-sedan-4a2-022018/audi-a6-s6-tdi-mild-hybrid-quattro-253-kw-344-ps-012021/kategori/suspansiyon/viraj-demir-aski-rotu" class="block px-4 py-2 hover:bg-gray-100 relative " wire:navigate.hover="">
                            <div class="flex items-center">
                                <!--[if BLOCK]><![endif]-->                                <img src="https://bcdn.aloparca.com/subcategory/images/viraj-demir-aski-rotu.jpg?width=24" alt="Bend Iron Suspension Rod" class="w-6 h-6 object-cover rounded-full mr-2" loading="lazy">
                                <!--[if ENDBLOCK]><![endif]-->
                                <span><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">Bend Iron Suspension Rod</font></font></span>
                            </div>
                        </a>
                    </li>
                                        <li>
                        <a href="https://aloparca.com/yedek-parcalar/audi/audi-a6/audi-a6-c8-sedan-4a2-022018/audi-a6-s6-tdi-mild-hybrid-quattro-253-kw-344-ps-012021/kategori/suspansiyon/rot-mili" class="block px-4 py-2 hover:bg-gray-100 relative " wire:navigate.hover="">
                            <div class="flex items-center">
                                <!--[if BLOCK]><![endif]-->                                <img src="https://bcdn.aloparca.com/subcategory/images/rot-mili.jpg?width=24" alt="Tie Rod" class="w-6 h-6 object-cover rounded-full mr-2" loading="lazy">
                                <!--[if ENDBLOCK]><![endif]-->
                                <span><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">Tie Rod</font></font></span>
                            </div>
                        </a>
                    </li>
                    <!--[if ENDBLOCK]><![endif]-->
                </ul>
            </div>
            <!--[if ENDBLOCK]><![endif]-->
        </li>
                <li class="border-b last:border-b-0">
            <div class="flex items-center justify-between px-4 py-2 hover:bg-gray-100 cursor-pointer " @click="openCategories['triger-zincir-ve-rulman'] = !openCategories['triger-zincir-ve-rulman']">
                <div class="flex items-center">
                                        <!--[if BLOCK]><![endif]-->                    <img src="https://bcdn.aloparca.com/category/image/01J7WV3B6CNEHGNNA2J5QY9DXP.png?width=32" alt="Timing Chain and Bearing" class="w-8 h-8 object-cover rounded-full mr-2" loading="lazy">
                    <!--[if ENDBLOCK]><![endif]-->
                    <span><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">Timing Chain and Bearing</font></font></span>
                </div>
                <!--[if BLOCK]><![endif]-->                <svg class="w-4 h-4 transform transition-transform" :class="{'rotate-180': openCategories['triger-zincir-ve-rulman']}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                </svg>
                <!--[if ENDBLOCK]><![endif]-->
            </div>
            <!--[if BLOCK]><![endif]-->            <div x-show="openCategories['triger-zincir-ve-rulman']" x-collapse="" style="height: 0px; overflow: hidden; display: none;" hidden="">
                <ul class="ml-4">
                    <!--[if BLOCK]><![endif]-->                    <li>
                        <a href="https://aloparca.com/yedek-parcalar/audi/audi-a6/audi-a6-c8-sedan-4a2-022018/audi-a6-s6-tdi-mild-hybrid-quattro-253-kw-344-ps-012021/kategori/triger-zincir-ve-rulman/v-kayisi" class="block px-4 py-2 hover:bg-gray-100 relative " wire:navigate.hover="">
                            <div class="flex items-center">
                                <!--[if BLOCK]><![endif]-->                                <div class="w-6 h-6 bg-gray-200 rounded-full mr-2 flex items-center justify-center">
                                    <span class="text-xs text-gray-500">V</span>
                                </div>
                                <!--[if ENDBLOCK]><![endif]-->
                                <span>V Kayışı</span>
                            </div>
                        </a>
                    </li>
                    <!--[if ENDBLOCK]><![endif]-->
                </ul>
            </div>
            <!--[if ENDBLOCK]><![endif]-->
        </li>
                <li class="border-b last:border-b-0">
            <div class="flex items-center justify-between px-4 py-2 hover:bg-gray-100 cursor-pointer " @click="openCategories['yakit-sistemi'] = !openCategories['yakit-sistemi']">
                <div class="flex items-center">
                                        <!--[if BLOCK]><![endif]-->                    <img src="https://bcdn.aloparca.com/category/image/10354.png?width=32" alt="Fuel System" class="w-8 h-8 object-cover rounded-full mr-2" loading="lazy">
                    <!--[if ENDBLOCK]><![endif]-->
                    <span><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">Fuel System</font></font></span>
                </div>
                <!--[if BLOCK]><![endif]-->                <svg class="w-4 h-4 transform transition-transform" :class="{'rotate-180': openCategories['yakit-sistemi']}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                </svg>
                <!--[if ENDBLOCK]><![endif]-->
            </div>
            <!--[if BLOCK]><![endif]-->            <div x-show="openCategories['yakit-sistemi']" x-collapse="" style="height: 0px; overflow: hidden; display: none;" hidden="">
                <ul class="ml-4">
                    <!--[if BLOCK]><![endif]-->                    <li>
                        <a href="https://aloparca.com/yedek-parcalar/audi/audi-a6/audi-a6-c8-sedan-4a2-022018/audi-a6-s6-tdi-mild-hybrid-quattro-253-kw-344-ps-012021/kategori/yakit-sistemi/depo-samandirasi" class="block px-4 py-2 hover:bg-gray-100 relative " wire:navigate.hover="">
                            <div class="flex items-center">
                                <!--[if BLOCK]><![endif]-->                                <img src="https://bcdn.aloparca.com/subcategory/images/depo-samandirasi.png?width=24" alt="Depo Şamandırası" class="w-6 h-6 object-cover rounded-full mr-2" loading="lazy">
                                <!--[if ENDBLOCK]><![endif]-->
                                <span>Depo Şamandırası</span>
                            </div>
                        </a>
                    </li>
                    <!--[if ENDBLOCK]><![endif]-->
                </ul>
            </div>
            <!--[if ENDBLOCK]><![endif]-->
        </li>
                <li class="border-b last:border-b-0">
            <div class="flex items-center justify-between px-4 py-2 hover:bg-gray-100 cursor-pointer " @click="openCategories['aydinlatma'] = !openCategories['aydinlatma']">
                <div class="flex items-center">
                                        <!--[if BLOCK]><![endif]-->                    <img src="https://bcdn.aloparca.com/category/image/01JJ44R9GR4BJMK692YGPNP5W5.png?width=32" alt="Lighting" class="w-8 h-8 object-cover rounded-full mr-2" loading="lazy">
                    <!--[if ENDBLOCK]><![endif]-->
                    <span><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">Lighting</font></font></span>
                </div>
                <!--[if BLOCK]><![endif]-->                <svg class="w-4 h-4 transform transition-transform" :class="{'rotate-180': openCategories['aydinlatma']}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                </svg>
                <!--[if ENDBLOCK]><![endif]-->
            </div>
            <!--[if BLOCK]><![endif]-->            <div x-show="openCategories['aydinlatma']" x-collapse="" style="display: none; height: 0px; overflow: hidden;" hidden="">
                <ul class="ml-4">
                    <!--[if BLOCK]><![endif]-->                    <li>
                        <a href="https://aloparca.com/yedek-parcalar/audi/audi-a6/audi-a6-c8-sedan-4a2-022018/audi-a6-s6-tdi-mild-hybrid-quattro-253-kw-344-ps-012021/kategori/aydinlatma/far" class="block px-4 py-2 hover:bg-gray-100 relative " wire:navigate.hover="">
                            <div class="flex items-center">
                                <!--[if BLOCK]><![endif]-->                                <img src="https://bcdn.aloparca.com/subcategory/images/far.png?width=24" alt="Far" class="w-6 h-6 object-cover rounded-full mr-2" loading="lazy">
                                <!--[if ENDBLOCK]><![endif]-->
                                <span>Far</span>
                            </div>
                        </a>
                    </li>
                    <!--[if ENDBLOCK]><![endif]-->
                </ul>
            </div>
            <!--[if ENDBLOCK]><![endif]-->
        </li>
                <li class="border-b last:border-b-0">
            <div class="flex items-center justify-between px-4 py-2 hover:bg-gray-100 cursor-pointer " @click="openCategories['motor'] = !openCategories['motor']">
                <div class="flex items-center">
                                        <!--[if BLOCK]><![endif]-->                    <img src="https://bcdn.aloparca.com/category/image/10102.png?width=32" alt="Engine" class="w-8 h-8 object-cover rounded-full mr-2" loading="lazy">
                    <!--[if ENDBLOCK]><![endif]-->
                    <span><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">Engine</font></font></span>
                </div>
                <!--[if BLOCK]><![endif]-->                <svg class="w-4 h-4 transform transition-transform" :class="{'rotate-180': openCategories['motor']}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                </svg>
                <!--[if ENDBLOCK]><![endif]-->
            </div>
            <!--[if BLOCK]><![endif]-->            <div x-show="openCategories['motor']" x-collapse="" style="display: none; height: 0px; overflow: hidden;" hidden="">
                <ul class="ml-4">
                    <!--[if BLOCK]><![endif]-->                    <li>
                        <a href="https://aloparca.com/yedek-parcalar/audi/audi-a6/audi-a6-c8-sedan-4a2-022018/audi-a6-s6-tdi-mild-hybrid-quattro-253-kw-344-ps-012021/kategori/motor/supap-lastigi" class="block px-4 py-2 hover:bg-gray-100 relative " wire:navigate.hover="">
                            <div class="flex items-center">
                                <!--[if BLOCK]><![endif]-->                                <img src="https://bcdn.aloparca.com/subcategory/images/supap-lastigi.jpg?width=24" alt="Supap Lastiği" class="w-6 h-6 object-cover rounded-full mr-2" loading="lazy">
                                <!--[if ENDBLOCK]><![endif]-->
                                <span>Supap Lastiği</span>
                            </div>
                        </a>
                    </li>
                                        <li>
                        <a href="https://aloparca.com/yedek-parcalar/audi/audi-a6/audi-a6-c8-sedan-4a2-022018/audi-a6-s6-tdi-mild-hybrid-quattro-253-kw-344-ps-012021/kategori/motor/eksantrik-devir-sensoru" class="block px-4 py-2 hover:bg-gray-100 relative " wire:navigate.hover="">
                            <div class="flex items-center">
                                <!--[if BLOCK]><![endif]-->                                <img src="https://bcdn.aloparca.com/subcategory/images/eksantrik-devir-sensoru.jpg?width=24" alt="Eksantrik Devir Sensörü" class="w-6 h-6 object-cover rounded-full mr-2" loading="lazy">
                                <!--[if ENDBLOCK]><![endif]-->
                                <span>Eksantrik Devir Sensörü</span>
                            </div>
                        </a>
                    </li>
                                        <li>
                        <a href="https://aloparca.com/yedek-parcalar/audi/audi-a6/audi-a6-c8-sedan-4a2-022018/audi-a6-s6-tdi-mild-hybrid-quattro-253-kw-344-ps-012021/kategori/motor/krank-sensoru" class="block px-4 py-2 hover:bg-gray-100 relative " wire:navigate.hover="">
                            <div class="flex items-center">
                                <!--[if BLOCK]><![endif]-->                                <img src="https://bcdn.aloparca.com/subcategory/images/krank-sensoru.jpg?width=24" alt="Krank Sensörü" class="w-6 h-6 object-cover rounded-full mr-2" loading="lazy">
                                <!--[if ENDBLOCK]><![endif]-->
                                <span>Krank Sensörü</span>
                            </div>
                        </a>
                    </li>
                                        <li>
                        <a href="https://aloparca.com/yedek-parcalar/audi/audi-a6/audi-a6-c8-sedan-4a2-022018/audi-a6-s6-tdi-mild-hybrid-quattro-253-kw-344-ps-012021/kategori/motor/motor-takozu" class="block px-4 py-2 hover:bg-gray-100 relative " wire:navigate.hover="">
                            <div class="flex items-center">
                                <!--[if BLOCK]><![endif]-->                                <img src="https://bcdn.aloparca.com/subcategory/images/motor-takozu.png?width=24" alt="Motor Takozu" class="w-6 h-6 object-cover rounded-full mr-2" loading="lazy">
                                <!--[if ENDBLOCK]><![endif]-->
                                <span>Motor Takozu</span>
                            </div>
                        </a>
                    </li>
                                        <li>
                        <a href="https://aloparca.com/yedek-parcalar/audi/audi-a6/audi-a6-c8-sedan-4a2-022018/audi-a6-s6-tdi-mild-hybrid-quattro-253-kw-344-ps-012021/kategori/motor/krank-kecesi" class="block px-4 py-2 hover:bg-gray-100 relative " wire:navigate.hover="">
                            <div class="flex items-center">
                                <!--[if BLOCK]><![endif]-->                                <img src="https://bcdn.aloparca.com/subcategory/images/krank-kecesi.jpg?width=24" alt="Krank Keçesi" class="w-6 h-6 object-cover rounded-full mr-2" loading="lazy">
                                <!--[if ENDBLOCK]><![endif]-->
                                <span>Krank Keçesi</span>
                            </div>
                        </a>
                    </li>
                                        <li>
                        <a href="https://aloparca.com/yedek-parcalar/audi/audi-a6/audi-a6-c8-sedan-4a2-022018/audi-a6-s6-tdi-mild-hybrid-quattro-253-kw-344-ps-012021/kategori/motor/krank-kasnak" class="block px-4 py-2 hover:bg-gray-100 relative " wire:navigate.hover="">
                            <div class="flex items-center">
                                <!--[if BLOCK]><![endif]-->                                <img src="https://bcdn.aloparca.com/subcategory/images/krank-kasnak.jpg?width=24" alt="Krank Kasnak" class="w-6 h-6 object-cover rounded-full mr-2" loading="lazy">
                                <!--[if ENDBLOCK]><![endif]-->
                                <span>Krank Kasnak</span>
                            </div>
                        </a>
                    </li>
                                        <li>
                        <a href="https://aloparca.com/yedek-parcalar/audi/audi-a6/audi-a6-c8-sedan-4a2-022018/audi-a6-s6-tdi-mild-hybrid-quattro-253-kw-344-ps-012021/kategori/motor/hava-debimetresi" class="block px-4 py-2 hover:bg-gray-100 relative " wire:navigate.hover="">
                            <div class="flex items-center">
                                <!--[if BLOCK]><![endif]-->                                <img src="https://bcdn.aloparca.com/subcategory/images/hava-debimetresi.png?width=24" alt="Hava Debimetresi" class="w-6 h-6 object-cover rounded-full mr-2" loading="lazy">
                                <!--[if ENDBLOCK]><![endif]-->
                                <span>Hava Debimetresi</span>
                            </div>
                        </a>
                    </li>
                    <!--[if ENDBLOCK]><![endif]-->
                </ul>
            </div>
            <!--[if ENDBLOCK]><![endif]-->
        </li>
                <li class="border-b last:border-b-0">
            <div class="flex items-center justify-between px-4 py-2 hover:bg-gray-100 cursor-pointer " @click="openCategories['direksiyon'] = !openCategories['direksiyon']">
                <div class="flex items-center">
                                        <!--[if BLOCK]><![endif]-->                    <img src="https://bcdn.aloparca.com/category/image/10112.png?width=32" alt="Steering wheel" class="w-8 h-8 object-cover rounded-full mr-2" loading="lazy">
                    <!--[if ENDBLOCK]><![endif]-->
                    <span><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">Steering wheel</font></font></span>
                </div>
                <!--[if BLOCK]><![endif]-->                <svg class="w-4 h-4 transform transition-transform" :class="{'rotate-180': openCategories['direksiyon']}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                </svg>
                <!--[if ENDBLOCK]><![endif]-->
            </div>
            <!--[if BLOCK]><![endif]-->            <div x-show="openCategories['direksiyon']" x-collapse="" style="display: none; height: 0px; overflow: hidden;" hidden="">
                <ul class="ml-4">
                    <!--[if BLOCK]><![endif]-->                    <li>
                        <a href="https://aloparca.com/yedek-parcalar/audi/audi-a6/audi-a6-c8-sedan-4a2-022018/audi-a6-s6-tdi-mild-hybrid-quattro-253-kw-344-ps-012021/kategori/direksiyon/direksiyon-korugu" class="block px-4 py-2 hover:bg-gray-100 relative " wire:navigate.hover="">
                            <div class="flex items-center">
                                <!--[if BLOCK]><![endif]-->                                <img src="https://bcdn.aloparca.com/subcategory/images/direksiyon-korugu.jpg?width=24" alt="Direksiyon Körüğü" class="w-6 h-6 object-cover rounded-full mr-2" loading="lazy">
                                <!--[if ENDBLOCK]><![endif]-->
                                <span>Direksiyon Körüğü</span>
                            </div>
                        </a>
                    </li>
                    <!--[if ENDBLOCK]><![endif]-->
                </ul>
            </div>
            <!--[if ENDBLOCK]><![endif]-->
        </li>
                <li class="border-b last:border-b-0">
            <div class="flex items-center justify-between px-4 py-2 hover:bg-gray-100 cursor-pointer " @click="openCategories['dis-kaporta-aksami'] = !openCategories['dis-kaporta-aksami']">
                <div class="flex items-center">
                                        <!--[if BLOCK]><![endif]-->                    <img src="https://bcdn.aloparca.com/category/image/10101.png?width=32" alt="Exterior Body Parts" class="w-8 h-8 object-cover rounded-full mr-2" loading="lazy">
                    <!--[if ENDBLOCK]><![endif]-->
                    <span><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">Exterior Body Parts</font></font></span>
                </div>
                <!--[if BLOCK]><![endif]-->                <svg class="w-4 h-4 transform transition-transform" :class="{'rotate-180': openCategories['dis-kaporta-aksami']}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                </svg>
                <!--[if ENDBLOCK]><![endif]-->
            </div>
            <!--[if BLOCK]><![endif]-->            <div x-show="openCategories['dis-kaporta-aksami']" x-collapse="" style="display: none; height: 0px; overflow: hidden;" hidden="">
                <ul class="ml-4">
                    <!--[if BLOCK]><![endif]-->                    <li>
                        <a href="https://aloparca.com/yedek-parcalar/audi/audi-a6/audi-a6-c8-sedan-4a2-022018/audi-a6-s6-tdi-mild-hybrid-quattro-253-kw-344-ps-012021/kategori/dis-kaporta-aksami/silecek-supurgesi" class="block px-4 py-2 hover:bg-gray-100 relative " wire:navigate.hover="">
                            <div class="flex items-center">
                                <!--[if BLOCK]><![endif]-->                                <img src="https://bcdn.aloparca.com/subcategory/images/silecek-supurgesi.png?width=24" alt="Silecek Süpürgesi" class="w-6 h-6 object-cover rounded-full mr-2" loading="lazy">
                                <!--[if ENDBLOCK]><![endif]-->
                                <span>Silecek Süpürgesi</span>
                            </div>
                        </a>
                    </li>
                    <!--[if ENDBLOCK]><![endif]-->
                </ul>
            </div>
            <!--[if ENDBLOCK]><![endif]-->
        </li>
                <li class="border-b last:border-b-0">
            <div class="flex items-center justify-between px-4 py-2 hover:bg-gray-100 cursor-pointer " @click="openCategories['sogutma'] = !openCategories['sogutma']">
                <div class="flex items-center">
                                        <!--[if BLOCK]><![endif]-->                    <img src="https://bcdn.aloparca.com/category/image/10341.png?width=32" alt="Cooling and Heating" class="w-8 h-8 object-cover rounded-full mr-2" loading="lazy">
                    <!--[if ENDBLOCK]><![endif]-->
                    <span><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">Cooling and Heating</font></font></span>
                </div>
                <!--[if BLOCK]><![endif]-->                <svg class="w-4 h-4 transform transition-transform" :class="{'rotate-180': openCategories['sogutma']}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                </svg>
                <!--[if ENDBLOCK]><![endif]-->
            </div>
            <!--[if BLOCK]><![endif]-->            <div x-show="openCategories['sogutma']" x-collapse="" style="display: none; height: 0px; overflow: hidden;" hidden="">
                <ul class="ml-4">
                    <!--[if BLOCK]><![endif]-->                    <li>
                        <a href="https://aloparca.com/yedek-parcalar/audi/audi-a6/audi-a6-c8-sedan-4a2-022018/audi-a6-s6-tdi-mild-hybrid-quattro-253-kw-344-ps-012021/kategori/sogutma/klima-radyatoru" class="block px-4 py-2 hover:bg-gray-100 relative " wire:navigate.hover="">
                            <div class="flex items-center">
                                <!--[if BLOCK]><![endif]-->                                <img src="https://bcdn.aloparca.com/subcategory/images/klima-radyatoru.jpg?width=24" alt="Klima Radyatörü" class="w-6 h-6 object-cover rounded-full mr-2" loading="lazy">
                                <!--[if ENDBLOCK]><![endif]-->
                                <span>Klima Radyatörü</span>
                            </div>
                        </a>
                    </li>
                                        <li>
                        <a href="https://aloparca.com/yedek-parcalar/audi/audi-a6/audi-a6-c8-sedan-4a2-022018/audi-a6-s6-tdi-mild-hybrid-quattro-253-kw-344-ps-012021/kategori/sogutma/devirdaim-su-pompasi" class="block px-4 py-2 hover:bg-gray-100 relative " wire:navigate.hover="">
                            <div class="flex items-center">
                                <!--[if BLOCK]><![endif]-->                                <img src="https://bcdn.aloparca.com/subcategory/images/devirdaim-su-pompasi.png?width=24" alt="Devirdaim Su Pompası" class="w-6 h-6 object-cover rounded-full mr-2" loading="lazy">
                                <!--[if ENDBLOCK]><![endif]-->
                                <span>Devirdaim Su Pompası</span>
                            </div>
                        </a>
                    </li>
                                        <li>
                        <a href="https://aloparca.com/yedek-parcalar/audi/audi-a6/audi-a6-c8-sedan-4a2-022018/audi-a6-s6-tdi-mild-hybrid-quattro-253-kw-344-ps-012021/kategori/sogutma/hararet-musuru" class="block px-4 py-2 hover:bg-gray-100 relative " wire:navigate.hover="">
                            <div class="flex items-center">
                                <!--[if BLOCK]><![endif]-->                                <img src="https://bcdn.aloparca.com/subcategory/images/hararet-musuru.jpg?width=24" alt="Hararet Müşürü" class="w-6 h-6 object-cover rounded-full mr-2" loading="lazy">
                                <!--[if ENDBLOCK]><![endif]-->
                                <span>Hararet Müşürü</span>
                            </div>
                        </a>
                    </li>
                    <!--[if ENDBLOCK]><![endif]-->
                </ul>
            </div>
            <!--[if ENDBLOCK]><![endif]-->
        </li>
                <li class="border-b last:border-b-0">
            <div class="flex items-center justify-between px-4 py-2 hover:bg-gray-100 cursor-pointer " @click="openCategories['elektrik'] = !openCategories['elektrik']">
                <div class="flex items-center">
                                        <!--[if BLOCK]><![endif]-->                    <img src="https://bcdn.aloparca.com/category/image/10110.png?width=32" alt="Electric" class="w-8 h-8 object-cover rounded-full mr-2" loading="lazy">
                    <!--[if ENDBLOCK]><![endif]-->
                    <span><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">Electric</font></font></span>
                </div>
                <!--[if BLOCK]><![endif]-->                <svg class="w-4 h-4 transform transition-transform" :class="{'rotate-180': openCategories['elektrik']}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                </svg>
                <!--[if ENDBLOCK]><![endif]-->
            </div>
            <!--[if BLOCK]><![endif]-->            <div x-show="openCategories['elektrik']" x-collapse="" style="display: none; height: 0px; overflow: hidden;" hidden="">
                <ul class="ml-4">
                    <!--[if BLOCK]><![endif]-->                    <li>
                        <a href="https://aloparca.com/yedek-parcalar/audi/audi-a6/audi-a6-c8-sedan-4a2-022018/audi-a6-s6-tdi-mild-hybrid-quattro-253-kw-344-ps-012021/kategori/elektrik/cam-su-motoru" class="block px-4 py-2 hover:bg-gray-100 relative " wire:navigate.hover="">
                            <div class="flex items-center">
                                <!--[if BLOCK]><![endif]-->                                <img src="https://bcdn.aloparca.com/subcategory/images/cam-su-motoru.jpg?width=24" alt="Cam Su Motoru" class="w-6 h-6 object-cover rounded-full mr-2" loading="lazy">
                                <!--[if ENDBLOCK]><![endif]-->
                                <span>Cam Su Motoru</span>
                            </div>
                        </a>
                    </li>
                                        <li>
                        <a href="https://aloparca.com/yedek-parcalar/audi/audi-a6/audi-a6-c8-sedan-4a2-022018/audi-a6-s6-tdi-mild-hybrid-quattro-253-kw-344-ps-012021/kategori/elektrik/korna" class="block px-4 py-2 hover:bg-gray-100 relative " wire:navigate.hover="">
                            <div class="flex items-center">
                                <!--[if BLOCK]><![endif]-->                                <div class="w-6 h-6 bg-gray-200 rounded-full mr-2 flex items-center justify-center">
                                    <span class="text-xs text-gray-500">K</span>
                                </div>
                                <!--[if ENDBLOCK]><![endif]-->
                                <span>Korna</span>
                            </div>
                        </a>
                    </li>
                                        <li>
                        <a href="https://aloparca.com/yedek-parcalar/audi/audi-a6/audi-a6-c8-sedan-4a2-022018/audi-a6-s6-tdi-mild-hybrid-quattro-253-kw-344-ps-012021/kategori/elektrik/park-sensoru" class="block px-4 py-2 hover:bg-gray-100 relative " wire:navigate.hover="">
                            <div class="flex items-center">
                                <!--[if BLOCK]><![endif]-->                                <img src="https://bcdn.aloparca.com/subcategory/images/park-sensoru.jpg?width=24" alt="Park Sensörü" class="w-6 h-6 object-cover rounded-full mr-2" loading="lazy">
                                <!--[if ENDBLOCK]><![endif]-->
                                <span>Park Sensörü</span>
                            </div>
                        </a>
                    </li>
                                        <li>
                        <a href="https://aloparca.com/yedek-parcalar/audi/audi-a6/audi-a6-c8-sedan-4a2-022018/audi-a6-s6-tdi-mild-hybrid-quattro-253-kw-344-ps-012021/kategori/elektrik/dis-hava-sicaklik-sensoru" class="block px-4 py-2 hover:bg-gray-100 relative " wire:navigate.hover="">
                            <div class="flex items-center">
                                <!--[if BLOCK]><![endif]-->                                <img src="https://bcdn.aloparca.com/subcategory/images/dis-hava-sicaklik-sensoru.jpg?width=24" alt="Dış Hava Sıcaklık Sensörü" class="w-6 h-6 object-cover rounded-full mr-2" loading="lazy">
                                <!--[if ENDBLOCK]><![endif]-->
                                <span>Dış Hava Sıcaklık Sensörü</span>
                            </div>
                        </a>
                    </li>
                    <!--[if ENDBLOCK]><![endif]-->
                </ul>
            </div>
            <!--[if ENDBLOCK]><![endif]-->
        </li>
        <!--[if ENDBLOCK]><![endif]-->
    </ul>
    <!--[if ENDBLOCK]><![endif]-->
</div>        </div>"""  

# Charger le fichier HTML
with open("htmlCateg.txt", "r", encoding="utf-8") as file:
    html_content = file.read()

# Parser le HTML avec BeautifulSoup
soup = BeautifulSoup(html_content, "html.parser")

# Dictionnaire de traduction (manuel)
translations = {
    "Filtreler": "Filters",
    "Yağlar ve Sıvılar": "Oils and Fluids",
    "Fren": "Brakes",
    "Süspansiyon": "Suspension",
    "Triger Zincir ve Rulman": "Timing Chain and Bearings",
    "Yakıt Sistemi": "Fuel System",
    "Aydınlatma": "Lighting",
    "Motor": "Engine",
    "Direksiyon": "Steering",
    "Dış Kaporta Aksamı": "Body & Exterior Parts",
    "Soğutma": "Cooling",
    "Elektrik": "Electrical",
    
    # Sous-catégories
    "Hava Filtresi": "Air Filter",
    "Polen Filtresi": "Cabin Filter",
    "Yağ Filtresi": "Oil Filter",
    "Yakıt Filtresi": "Fuel Filter",
    "Fren Balatası": "Brake Pads",
    "Disk Fren": "Brake Disc",
    "Amortisör": "Shock Absorber",
    "Rot Başları": "Tie Rod Ends",
    "Su Pompası": "Water Pump",
    "Marş Motoru": "Starter Motor",
    "Far Ampulü": "Headlight Bulb",
    "Bujiler": "Spark Plugs",
    "Egzoz Manifoldu": "Exhaust Manifold"
}

# Fonction pour traduire un texte si absent du dictionnaire
def translate_text(text):
    if text in translations:
        return translations[text]  # Utiliser la traduction manuelle si dispo
    else:
        translated = GoogleTranslator(source="tr", target="en").translate(text)
        translations[text] = translated  # Ajouter au dictionnaire
        return translated

# Initialiser la structure de données
categories_data = []

# Trouver toutes les catégories principales
categories = soup.find_all("li", class_="border-b last:border-b-0")

for category in categories:
    category_name = category.find("span").text.strip()
    category_name_en = translate_text(category_name)  # Traduction dynamique
    category_img = category.find("img")["src"] if category.find("img") else ""
    
    subcategories = []
    
    # Trouver toutes les sous-catégories
    subcategory_items = category.find_all("li")
    
    for subcategory in subcategory_items:
        sub_a = subcategory.find("a")
        sub_img = subcategory.find("img")
        
        if sub_a and sub_img:
            sub_name = sub_a.find("span").text.strip()
            sub_name_en = translate_text(sub_name)  # Traduction dynamique
            
            subcategories.append({
                "name": sub_name_en,
                "image": sub_img["src"],
            })
    
    # Ajouter la catégorie principale avec ses sous-catégories
    categories_data.append({
        "category": category_name_en,
        "image": category_img,
        "subcategories": subcategories
    })

# Sauvegarder les données en JSON
with open("categories_en.json", "w", encoding="utf-8") as json_file:
    json.dump(categories_data, json_file, indent=4, ensure_ascii=False)

print("✅ Data successfully saved in categories_en.json with full translation.")
