"use client";
import Link from "next/link";
import "./index.scss";

interface NavbarProps {
  onHomeClick?: () => void;
}

export default function Navbar({ onHomeClick }: NavbarProps) {
  return (
    <nav className="navbar">
      <div className="logo">🎬 CineFinder</div>
      <ul className="nav-links">
        <li>
          <Link href="/" onClick={onHomeClick}>Início</Link>
        </li>
        <li>
          <Link href="/favoritos">Favoritos</Link>
        </li>
      </ul>
    </nav>
  );
}