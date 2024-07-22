"use client"
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import TableModeration from "@/components/Tables/TableModeration";



const ReportsTablePage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Modération" pageGo="/"/>
      <div className="flex flex-col gap-10">
        <TableModeration/>
      </div>
    </DefaultLayout>
  );
};

export default ReportsTablePage;
