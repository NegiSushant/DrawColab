import Link from "next/link";

export default function Home() {
  return (
    <div className="justify-between ">
      <Link href="/signin">
        <button>Sign In</button>
      </Link>
      <Link href="/signup">
        <button>Sign Up</button>
      </Link>
    </div>
  );
}
