import Doctors from "#/svg/doctors.svg?react";
// TODO: dynamic image & sizing, variants
export default function SubHeader() {
  return (
    <div className="container-grid gap-y-8">
      <Doctors className="col-start-[content]" />
      <div className="max-1024:ml-(--logo-offset) col-[content/full] 1024:col-[7/content] bg-ci-dark h-100 rounded-bl-[50px]"></div>
    </div>
  );
}
