import { SharedWorkerPolyfill as WebWorker } from '@okikio/sharedworker';

let NewWorker = new WebWorker('', {
    name: 'typescript-worker'
});
NewWorker.start();
