import Link from "next/link";
interface BreadcrumbProps {
  pageName: string;
  pageGo: string;

}
const Breadcrumb = ({ pageName, pageGo }: BreadcrumbProps) => {
  console.log("pageGo", pageGo);
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="text-title-md2 font-semibold text-black dark:text-white">
        {pageName}
      </h2>

      <nav>
        <ol className="flex items-center gap-2">
          <li>
            <Link className="font-medium" href={"/"+pageGo}>
              
            </Link>
          </li>
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;
