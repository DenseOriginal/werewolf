import Spinner from "@/components/spinner"

export const LoadingView = () => {
	return <div className="flex flex-col items-center justify-center gap-4 h-full">
		<Spinner size="xl" />
		<h1 className="text-xl">Loading...</h1>
	</div>
}
