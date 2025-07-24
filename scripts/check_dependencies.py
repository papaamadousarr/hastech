#!/usr/bin/env python3
"""
Script de vérification et installation des dépendances
pour la migration MongoDB
"""

import subprocess
import sys

def check_python_version():
    """Vérifier la version de Python"""
    version = sys.version_info
    if version.major < 3 or (version.major == 3 and version.minor < 8):
        print("❌ Python 3.8+ requis")
        return False
    print(f"✅ Python {version.major}.{version.minor}.{version.micro}")
    return True

def install_package(package):
    """Installer un package avec pip"""
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", package])
        return True
    except subprocess.CalledProcessError:
        return False

def check_and_install_dependencies():
    """Vérifier et installer les dépendances"""
    required_packages = [
        "pymongo",
        "python-dotenv"
    ]
    
    missing_packages = []
    
    for package in required_packages:
        try:
            __import__(package.replace("-", "_"))
            print(f"✅ {package} est installé")
        except ImportError:
            print(f"❌ {package} n'est pas installé")
            missing_packages.append(package)
    
    if missing_packages:
        print(f"\n📦 Installation des packages manquants...")
        for package in missing_packages:
            print(f"   Installation de {package}...")
            if install_package(package):
                print(f"   ✅ {package} installé avec succès")
            else:
                print(f"   ❌ Échec de l'installation de {package}")
                return False
    
    return True

def main():
    """Fonction principale"""
    print("🔍 Vérification des dépendances")
    print("=" * 40)
    
    # Vérifier Python
    if not check_python_version():
        return False
    
    # Vérifier et installer les dépendances
    if not check_and_install_dependencies():
        print("❌ Impossible d'installer toutes les dépendances")
        return False
    
    print("\n✅ Toutes les dépendances sont prêtes!")
    print("🚀 Vous pouvez maintenant exécuter le script de migration:")
    print("   python migrate_products.py")
    
    return True

if __name__ == "__main__":
    success = main()
    if not success:
        sys.exit(1) 