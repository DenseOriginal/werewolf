export interface ToastrItem {
	type: 'info' | 'error';
	title: string;
	message: string;
	id: string;
}

export class Toastr {
	public static timeout = 3000;

	private static _instance?: Toastr;
	public static get instance(): Toastr {
		if (!this._instance) {
			this._instance = new Toastr();
		}
		return this._instance;
	}
	public static destroy() {
		this._instance = undefined;
	}

	private queue: ToastrItem[] = [];
	private constructor() { }

	private pushToQueue = (type: ToastrItem['type']) => (title: string, message: string) => {
		const toast: ToastrItem = { type, title, message, id: Math.random().toString() };
		this.queue.push(toast);
		this.processQueue();
		setTimeout(
			() => {
				this.queue = this.queue.filter((item) => item !== toast);
				this.processQueue();
			},
			Toastr.timeout
		);
	}

	private listener?: (queue: ToastrItem[]) => void;
	public setListener = (listener: (queue: ToastrItem[]) => void) => {
		this.listener = listener;
	}

	private processQueue = () => {
		if (this.listener) {
			this.listener([...this.queue]);
		}
	}

	public static info = Toastr.instance.pushToQueue('info');
	public static error = Toastr.instance.pushToQueue('error');
}
